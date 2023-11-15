const models = require('../../models');
const sequelize = models.Sequelize;
import { dd } from '../../../utils';
const axios = require('axios');
const config = require('../../../config');
const { TwitterApi } = require('twitter-api-v2');

interface TwitterConfig {
  TWITTER_API_KEY: string;
  TWITTER_API_KEY_SECRET: string;
  TWITTER_API_ACCESS_TOKEN: string;
  TWITTER_API_ACCESS_TOKEN_SECRET: string;
  TWITTER_API_BEARER_TOKEN: string;
}
export interface TwitterPage {
  locality_id: number;
  page_name: string;
  page_id: string;
}
export interface SendResult {
  error: boolean;
  message: string;
  response: string;
  userCount: number;
}

interface ExtendedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
export class Twitter {
  appId: string;
  appSecret: string;
  mock: boolean;
  twitterVersion: string;
  constructor() {
    this.appId = config.TWITTER_APP_ID;
    this.appSecret = config.TWITTER_APP_SECRET;
    this.twitterVersion = config.TWITTER_VERSION ?? 'v18.0';
    if (config.IS_UNIT_TEST || config.MOCK_TWITTER) {
      console.info(
        `Twitter recognizes UNIT TEST / MOCK_TWITTER: Mocking API calls`
      );
      this.mock = true;
    } else {
      console.info(`Twitter ready to make PRODUCTION requests`);
      this.mock = false;
    }
  }
  setConfiguration(
    appSecret: string,
    appId: string,
    twitterVersion: string,
    mock: boolean
  ) {
    this.appSecret = appSecret;
    this.appId = appId;
    this.twitterVersion = twitterVersion;
    this.mock = mock;
  }
  getConfiguration(): {
    appSecret: string;
    appId: string;
    mock: boolean;
    twitterVersion: string;
  } {
    return {
      appSecret: this.appSecret,
      appId: this.appId,
      mock: this.mock,
      twitterVersion: this.twitterVersion,
    };
  }

  getMock(): boolean {
    return this.mock;
  }
  async logMessages(
    response: string,
    error: string,
    userIdList: Array<number>
  ) {
    let row = await models.PushNotificationsQueueLog.create({
      response_message: response,
      error_message: error,
      userIdList: JSON.stringify(userIdList),
    });
    await row.save();
  }
  async save_tokens(
    user: Express.MiddlewareUser,
    pageName: string
  ): Promise<string> {
    if (!['admin', 'super'].includes(user.role)) {
      throw 'You do not have permission to do that';
    }
    let page: string = pageName.replace(/[^0-9_a-z]+/gi, '');
    return 'ok';
  }

  async is_locality_expired(localityId: number): Promise<boolean> {
    return false;
  }
  async getCredentialsForIncident(
    in_incident: ION.Incident | number
  ): Promise<ION.TwitterModel | null> {
    let incident: ION.Incident;
    if (typeof in_incident === 'number') {
      let r: any = await this.fetchIncident(in_incident);
      if (r === null) {
        return null;
      }
      incident = r;
    } else {
      incident = in_incident;
    }

    let twModel: ION.TwitterModel = {
      TWITTER_API_KEY: '',
      TWITTER_API_KEY_SECRET: '',
      TWITTER_API_ACCESS_TOKEN: '',
      TWITTER_API_ACCESS_TOKEN_SECRET: '',
      TWITTER_API_BEARER_TOKEN: '',
    };
    let r: any = await models.Locality.findAll({
      where: {
        id: incident.locality,
      },
      raw: true,
    });
    if (!r || r.length === 0) {
      return null;
    }
    twModel.TWITTER_API_KEY = r[0].twitter_api_key;
    twModel.TWITTER_API_KEY_SECRET = r[0].twitter_api_secret;
    twModel.TWITTER_API_ACCESS_TOKEN = r[0].twitter_access_token;
    twModel.TWITTER_API_ACCESS_TOKEN_SECRET = r[0].twitter_access_token_secret;
    twModel.TWITTER_API_BEARER_TOKEN = r[0].twitter_bearer_token;
    return twModel;
  }

  async makePost(
    in_incident: ION.Incident | number
  ): Promise<Array<[string, string]>> {
    let status: Array<[string, string]> = [];
    let incident: ION.Incident;
    if (typeof in_incident === 'number') {
      let r: any = await this.fetchIncident(in_incident);
      if (r === null) {
        throw 'Couldnt find incident by id';
      }
      incident = r;
    } else {
      incident = in_incident;
    }
    const row: ION.TwitterModel | null =
      await this.getCredentialsForIncident(incident);
    if (row === null) {
      status.push(['no-op', 'no credentials for incident']);
      return status;
    }
    const tweet: string = await this.generateIncidentMessage(incident);
    const client: typeof TwitterApi = new TwitterApi({
      appKey: row.TWITTER_API_KEY,
      appSecret: row.TWITTER_API_KEY_SECRET,
      accessToken: row.TWITTER_API_ACCESS_TOKEN,
      accessSecret: row.TWITTER_API_ACCESS_TOKEN_SECRET,
      bearerToken: row.TWITTER_API_BEARER_TOKEN,
    });

    const rwClient = client.readWrite;

    let res = null;
    let errMsg = '';
    try {
      status.push(['posting', tweet]);
      res = await rwClient.v2.tweet(tweet).catch((error: any) => {
        console.debug(JSON.stringify(error, null, 2));
        let copy = JSON.parse(JSON.stringify(error));
        status.push([
          'error',
          `status: ${copy.error.status}, code: ${copy.code}. message: ${copy.error.detail}`,
        ]);
        return null;
      });
      status.push(['postOnTwitter response', JSON.stringify(res, null, 2)]);
    } catch (error: any) {
      if (typeof error === 'string') {
        status.push(['error', error]);
      } else if ('message' in error) {
        status.push(['error', error.message]);
      } else {
        status.push(['error', JSON.stringify(error)]);
      }
      console.error(error);
    }
    return status;
  }
  async fetchIncident(id: number): Promise<ION.Incident | null> {
    let r: any = await models.Incident.findAll({
      where: {
        id: id,
      },
      raw: true,
    });
    if (r && r.length) {
      return r[0];
    }
    return null;
  }
  async generateIncidentMessage(incident: ION.Incident): Promise<string> {
    /**
     * 
<Sublocality> *<Field1Value>* <Field3Value>
Address
<Field2Value>NOTE: If field3value is a number and only a number, prepend the word Box
ex: 4156 should become Box 4156

EXAMPLE:
Queens *2nd Alarm* Box 9104
137-59 71st Ave
Fire in a private dwelling

     */
    let str: string = '';
    let locStrings: [string, string] = await this.getLocalityStrings(incident);
    if (locStrings[1].length) {
      str = locStrings[1] + ' ';
    }
    str += `*${String(incident.field1_value).toUpperCase()}*`;
    const nycLocalityID: number = await this.getNycLocalityId();
    if (
      typeof incident.field3_value !== 'undefined' &&
      incident.field3_value !== null &&
      String(incident.field3_value).length > 0
    ) {
      if (
        nycLocalityID === incident.locality ||
        isNaN(parseInt(incident.field3_value, 10)) === false
      ) {
        str += ` Box ${incident.field3_value}\n`;
      } else {
        str += ` ${incident.field3_value}\n`;
      }
    } else {
      str += `\n`;
    }
    str += incident.address + '\n';
    str += String(incident.field2_value).toUpperCase();
    return str;
  }
  async getLocalityStrings(incident: ION.Incident): Promise<[string, string]> {
    let arr: [string, string] = ['', ''];
    let loc: ION.Locality = await models.Locality.findOne({
      where: {
        id: incident.locality,
      },
    });
    arr = [loc.name, ''];
    if (
      typeof incident.sub_locality !== 'undefined' &&
      incident.sub_locality !== null
    ) {
      let sub: ION.SubLocality = await models.SubLocality.findOne({
        where: {
          id: incident.sub_locality,
        },
      });
      arr = [loc.name, sub.name];
    }
    return arr;
  }
  async getNycLocalityId(): Promise<number> {
    const rows = await models.Locality.findAll({
      where: {
        name: 'New York City',
      },
    });
    return rows[0].id;
  }
  async getUser(id: number): Promise<ION.User | null> {
    return await models.User.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
  }
  async logStatus(
    status: Array<[string, string]>,
    incident: ION.Incident
  ): Promise<void> {
    let m: string = '';
    let err: string = '';
    for (const tuple of status) {
      if (tuple[0].match(/^error/i)) {
        err += tuple[0] + '=>' + tuple[1] + '\n';
        continue;
      }
      m += tuple[0] + '=>' + tuple[1] + '\n';
    }
    await models.PushNotificationsQueueLog.create({
      incident_id: incident.id,
      response_message: m,
      error_message: err,
    });
  }
  async available_and_active_pages(
    localityId: number
  ): Promise<Array<TwitterPage>> {
    let p: Array<TwitterPage> = [];
    let resp: any = await models.Locality.findAll({
      where: {
        id: localityId,
      },
      raw: true,
    });
    for (let row of resp) {
      const fields: Array<string> = [
        'twitter_api_key',
        'twitter_api_secret',
        'twitter_access_token',
        'twitter_access_token_secret',
        'twitter_bearer_token',
      ];
      for(const field of fields){
        if(!row[field] || String(row[field]).length === 0){
          return [];
        }
      }
      let tp: TwitterPage = {
        locality_id: localityId,
        page_name: row.twitter_page_name,
        page_id: row.id,
      };
      p.push(tp);
    }
    return p;
  }
}
