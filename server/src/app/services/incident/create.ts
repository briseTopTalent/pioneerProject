const models = require('../../models');
const {createRedisIncident}= require('../../../database/redis');
const addressParser = require('../../../utils/addressParser');
import { IncidentNotifier } from '../push-notifications/incident-notifier';
import { Facebook } from '../push-notifications/facebook';
import { Twitter } from '../push-notifications/twitter';

export const createIncident = async (
  userId: number,
  incident: ION.Incident,
  send_push_notification: boolean,
  facebook_pages: Array<string>,
  twitter: Array<string>
) => {
  let push_notifications_queued: boolean = false;
  try {
    const d = await models.Locality.findOne({
      where: { id: incident.locality },
      attributes: ['name'],
    });
    if (!d) {
      return {
        error: true,
        message: "The specified locality doesn't exist.",
        data: {},
        push_notifications_queued,
      };
    }
    const newD = await models.Incident.create(incident);

    if (!newD) {
      return {
        error: true,
        message: `Unable to create incident`,
        data: {},
        push_notifications_queued,
      };
    }
    await createRedisIncident(newD.id);

    if (send_push_notification) {
      const notifier: IncidentNotifier = new IncidentNotifier();
      notifier.createRowsInPushNotificationsTable(newD);
      push_notifications_queued = true;
    }
    if(facebook_pages.length){
      let pages : Array<string> = [];
      for(let p of facebook_pages){
        let tmp: string = String(p);
        tmp = tmp.replace(/[^0-9a-z_-]+/gi,'');
        if(tmp.length === 0 || pages.indexOf(tmp) > -1){
          continue;
        }
        pages.push(tmp);
      }
      let fb: Facebook = new Facebook();
      for(const page of pages){
        let r: any = await fb.post_to_page(page,incident);
        console.debug(r);
      }
    }
    if(twitter.length){
      let twitterLib: Twitter = new Twitter();
      let r : any = await twitterLib.makePost(incident);
      console.debug(r);
    }
    return {
      error: false,
      data: {},
      message: 'success',
      push_notifications_queued,
    };
  } catch (err) {
    if (typeof err === 'string') {
      return {
        error: true,
        data: err,
        message: err,
        push_notifications_queued,
      };
    }
    if (err instanceof Error) {
      return {
        error: true,
        data: err,
        message: err.message,
        push_notifications_queued,
      };
    }
    return {
      error: true,
      data: {},
      message: String(err),
      push_notifications_queued,
    };
  }
};
