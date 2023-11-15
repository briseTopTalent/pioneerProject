//TODO FIXME: this doesn't work
//import {FB, FacebookApiException} from 'fb';

const models = require('../../models');
const sequelize = models.Sequelize;
import { dd } from '../../../utils';
const axios = require('axios');
const config = require('../../../config');

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
export interface FacebookPage {
  created_by_name: string;
  created_by_email: string;
  expiration_date: Date;
  locality_id: number;
  page_name: string;
  page_id: string;
}
export class Facebook {
  appId: string;
  appSecret: string;
  mock: boolean;
  facebookVersion: string;
  serverDomain: string;
  constructor() {
    this.appId = config.FB_APP_ID;
    this.appSecret = config.FB_APP_SECRET;
    this.facebookVersion = config.FB_VERSION ?? 'v18.0';
    this.serverDomain = config.SERVER_URL;
    if (config.IS_UNIT_TEST || config.MOCK_FB) {
      console.info(
        `Facebook recognizes UNIT TEST / MOCK_FB: Mocking API calls`
      );
      this.mock = true;
    } else {
      console.info(`Facebook ready to make PRODUCTION requests`);
      this.mock = false;
    }
  }
  setConfiguration(
    appSecret: string,
    appId: string,
    facebookVersion: string,
    serverDomain: string,
    mock: boolean
  ) {
    this.appSecret = appSecret;
    this.appId = appId;
    this.facebookVersion = facebookVersion;
    this.serverDomain = serverDomain;
    this.mock = mock;
  }
  getConfiguration(): {
    appSecret: string;
    appId: string;
    mock: boolean;
    facebookVersion: string;
    serverDomain: string;
  } {
    return {
      appSecret: this.appSecret,
      appId: this.appId,
      mock: this.mock,
      facebookVersion: this.facebookVersion,
      serverDomain: this.serverDomain,
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
    localityID: number,
    fbUserId: string,
    fbAccessToken: string,
    expiresIn: number | null,
    signedRequest: string | null,
    expirationTime: number | null
  ): Promise<string> {
    if (!['admin', 'super'].includes(user.role)) {
      throw 'You do not have permission to do that';
    }
    let userId: string = fbUserId.replace(/[^0-9_a-z]+/gi, '');
    let accessToken: string = fbAccessToken.replace(/[^a-z.0-9_\-+]+/gi, '');
    const url: string = `https://graph.facebook.com/${userId}/accounts?access_token=${accessToken}`;
    console.debug(`fetching graph: ${url}`);
    let r: any = await fetch(url)
      .then(async (res: any) => {
        return await res.json();
      })
      .then(async (jsonResponse: any) => {
        return await jsonResponse;
      })
      .catch((err: any) => {
        console.error(`error: `, err);
        return null;
      });
    if (r === null) {
      throw 'Unable to contact the Facebook API';
    }
    if (Array.isArray(r.data)) {
      await models.Facebook.destroy({
        where: {
          locality_id: localityID,
          _user: user.id,
        },
      });
      for (const entry of r.data) {
        let ext: ExtendedTokenResponse | null = await this.extend_token(
          entry.access_token
        );
        if (ext !== null) {
          await models.Facebook.create({
            _user: user.id,
            locality_id: localityID,
            page_name: entry.name,
            page_id: entry.id,
            access_token: entry.access_token,
            fb_user_id: fbUserId,
            fb_original_access_token: fbAccessToken,
            long_lived_access_token: ext.access_token,
            long_lived_expires_in: ext.expires_in,
            expires_in: expiresIn,
            expiration_time: expirationTime,
            signed_request: signedRequest,
          });
        } else {
          await models.Facebook.create({
            _user: user.id,
            locality_id: localityID,
            page_name: entry.name,
            page_id: entry.id,
            access_token: entry.access_token,
            fb_user_id: fbUserId,
            fb_original_access_token: fbAccessToken,
            expires_in: expiresIn,
            expiration_time: expirationTime,
            signed_request: signedRequest,
          });
        }
      }
    }
    console.debug(JSON.stringify(r.data, null, 2));
    return 'ok';
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
  async post_to_page(
    pageId: string,
    in_incident: ION.Incident | number
  ): Promise<Array<[string, string]>> {
    let status: Array<[string, string]> = [];
    let incident: ION.Incident;
    if(typeof in_incident === 'number'){
      let r: any = await this.fetchIncident(in_incident);
      if(r === null){
        throw 'Couldnt find incident id'
      }
      incident = r;
    }else{
      incident = in_incident;
    }

    pageId = pageId.replace(/[^0-9_a-z]+/gi, '');
    let resp: any = await models.Facebook.findAll({
      where: {
        locality_id: incident.locality,
        page_id: pageId,
        active: true,
      },
      raw: true,
    });
    let found: boolean = false;
    let foundRow: any = {};
    let pagesPostedTo: Array<string> = [];
    const msg: string = await this.generateIncidentMessage(incident);
    status.push(['message',msg]);
    for (const row of resp) {
      let d: Date = new Date(row.created_at);
      let seconds: number = row.long_lived_expires_in;
      if(seconds === null){
        seconds = row.expires_in;
      }
      if (d.getTime() + (seconds * 1000) > Date.now()) {
        found = true;
        foundRow = row;
        let userId: string = foundRow.fb_user_id;
        let accessToken: string = foundRow.long_lived_access_token;
        let pageId: string = foundRow.page_id;
        if (pagesPostedTo.indexOf(pageId) > -1) {
          status.push(['skipping',`"${foundRow.page_name}"(${foundRow.page_id}). Already posted to that page`]);
          console.debug(
            `Skipping page: "${foundRow.page_name}"(${foundRow.page_id}). We already posted to that page.`
          );
          continue;
        }
        pagesPostedTo.push(pageId);

        const url: string = `https://graph.facebook.com/${this.facebookVersion}/${pageId}/feed`;
        console.debug(`Fetching graph2: ${url}`);
        status.push(['url',url]);
        let body: string = JSON.stringify({
            message: msg,
            access_token: foundRow.long_lived_access_token,
        });
        status.push(['body',body]);
        let r: any = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
          .then(async (res: any) => {
            return await res.json();
          })
          .then(async (jsonResponse: any) => {
            return await jsonResponse;
          })
          .catch((err: any) => {
            console.error(`error: `, err);
            return null;
          });
        if (r === null) {
          status.push([
            'error',
            `Page: "${foundRow.page_name}"(${pageId}): Unable to contact the Facebook API`,
          ]);
        } else {
          status.push([
            'success',
            `Posted to "${foundRow.page_name}" successfully`,
          ]);
          status.push(['response', JSON.stringify(r, null, 2)]);
          console.debug(JSON.stringify(r, null, 2));
        }
      }
    }
    let str: string = '';
    for (const page_id of pagesPostedTo) {
      str += `${page_id},`;
    }
    status.push(['pages_posted_to', str]);
    this.logStatus(status,incident);
    return status;
  }
  async fetchIncident(id: number) : Promise<ION.Incident|null> {
    let r : any = await models.Incident.findAll({
      where: {
        id: id,
      },
      raw: true,
    });
    if(r && r.length){
      return r[0];
    }
    return null;
  }
  async logStatus(status: Array<[string,string]>,incident: ION.Incident) : Promise<void> {
    let m : string = '';
    let err: string = '';
    for(const tuple of status){
      if(tuple[0].match(/^error/i)){
        err += tuple[0] + "=>" + tuple[1] + "\n";
        continue;
      }
      m += tuple[0] + "=>" + tuple[1] + "\n";
    }
    await models.PushNotificationsQueueLog.create({
      incident_id: incident.id,
      response_message: m,
      error_message: err,
    });
  }
  async extend_token(
    fbAccessToken: string
  ): Promise<ExtendedTokenResponse | null> {
    let accessToken: string = fbAccessToken.replace(/[^a-z.0-9_\-+]+/gi, '');
    const url: string =
      `https://graph.facebook.com/${this.facebookVersion}/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${this.appId}&` +
      `client_secret=${this.appSecret}&` +
      `fb_exchange_token=${accessToken}`;
    console.debug(`fetching extend token url: ${url}`);
    let r: any = await fetch(url)
      .then(async (res: any) => {
        return await res.json();
      })
      .then(async (jsonResponse: any) => {
        return await jsonResponse;
      })
      .catch((err: any) => {
        console.error(`error: `, err);
        return null;
      });
    console.debug(`extend token response: `,JSON.stringify(r,null,2));
    if (r === null) {
      return null;
    }
    let resp: ExtendedTokenResponse = {
      access_token: r.access_token,
      token_type: r.token_type,
      expires_in: r.expires_in,
    };
    return resp;
  }
  async is_locality_expired(localityId: number): Promise<boolean> {
    let resp: any = await models.Facebook.findAll({
      where: {
        locality_id: localityId,
        active: true,
      },
      raw: true,
    });
    for (const row of resp) {
      let d: Date = new Date(row.created_at);
      let seconds: number = row.long_lived_expires_in;
      if(seconds === 0 || seconds === null){
        seconds = row.expires_in;
      }
      if (d.getTime() + (seconds * 1000) > Date.now()) {
        return false;
      }
    }
    return true;
  }
  async getUser(id: number): Promise<ION.User | null> {
    return await models.User.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
  }
  async available_and_active_pages(
    localityId: number
  ): Promise<Array<FacebookPage>> {
    let p: Array<FacebookPage> = [];
    let resp: any = await models.Facebook.findAll({
      where: {
        locality_id: localityId,
        active: true,
      },
      raw: true,
    });
    for (let row of resp) {
      let d: Date = new Date(row.created_at);
      let seconds: number = row.long_lived_expires_in;
      if(seconds === 0 || seconds === null){
        seconds = row.expires_in;
      }
      console.debug({seconds,d: new Date(d.getTime() + seconds * 1000)});
      if (d.getTime() + (seconds * 1000) < Date.now()) {
        continue;
      }
      let fb: FacebookPage = {
        created_by_name: '',
        created_by_email: '',
        expiration_date: new Date(d.getTime() + (seconds * 1000)),
        locality_id: localityId,
        page_name: row.page_name,
        page_id: row.page_id,
      };
      let user: ION.User | null = await this.getUser(row._user);
      if (user !== null) {
        fb.created_by_name = [user.first_name, user.last_name].join(' ');
        fb.created_by_email = user.email;
      } else {
        fb.created_by_name = 'unknown';
        fb.created_by_email = 'unknown';
      }
      p.push(fb);
    }
    return p;
  }
}
