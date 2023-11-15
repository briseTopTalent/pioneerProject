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

export class OneSignal {
  apiKey: string;
  appId: string;
  mock: boolean;
  url: string;
  constructor() {
    this.apiKey = config.ONE_SIGNAL_API_KEY;
    this.appId = config.ONE_SIGNAL_APP_ID;
    if (config.IS_UNIT_TEST || config.MOCK_ONE_SIGNAL) {
      console.info(`OneSignal recognizes UNIT TEST / MOCK_ONE_SIGNAL: Mocking API calls`);
      this.mock = true;
      /**
       * Doesn't necessarily have to be a valid endpoint. The point is just
       * that we're hitting something besides production
       */
      this.url = 'https://fireweb.ddns.net/api/v1/mock-notifications';
    } else {
      console.info(`OneSignal ready to make PRODUCTION requests`);
      this.mock = false;
      this.url = 'https://onesignal.com/api/v1/notifications';
    }
  }
  setConfiguration(apiKey:string,appId:string,url:string,mock: boolean) {
    this.apiKey = apiKey;
    this.appId = appId;
    this.url = url;
    this.mock = mock;
  }
  getConfiguration() : {apiKey: string,appId: string,url: string,mock: boolean}{
    return {
      apiKey: this.apiKey,
      appId: this.appId,
      url: this.url,
      mock: this.mock,
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
    })
    await row.save()
  }
  async send(userIdList: Array<number>, msg: string): Promise<SendResult> {
    return new Promise(async (resolve, reject) => {
      let userIds: Array<string> = []
      for(const uid of userIdList){
        userIds.push(String(uid));
      }
      const options = {
        method: 'POST',
        url: this.url,
        headers: {
          accept: 'application/json',
          Authorization: `Basic ${this.apiKey}`,
          'content-type': 'application/json',
        },
        data: {
          app_id: this.appId,
          contents: {
            en: msg,
          },
          name: 'notification',
          include_external_user_ids: userIds,
        },
      };
      if (this.mock) {
        this.logMessages(
          JSON.stringify({ mocked: true, options }),
          'none',
          userIdList
        );
        resolve({
          error: false,
          message: 'ok/mocked',
          response: JSON.stringify({ mocked: true, options }),
          userCount: userIdList.length,
        });
        return;
      }

      axios
        .request(options)
        .then((response: any) => {
          this.logMessages(
            JSON.stringify({ mocked: false, options, response: '', }),
            'none',
            userIdList
          );
          resolve({
            error: false,
            message: 'ok',
            response: '',
            userCount: userIdList.length,
          });
        })
        .catch((error: Error | string) => {
          console.error(error);
          this.logMessages(
            JSON.stringify({ mocked: false, options }),
            JSON.stringify(error),
            userIdList
          );
          let msg: string = 'error';
          if (error instanceof Error) {
            msg = error.message;
          }
          if (typeof error === 'string') {
            msg = error;
          }
          reject({
            error: true,
            message: msg,
            response: '',
            userCount: userIdList.length,
          });
        });
    });
  }
}
