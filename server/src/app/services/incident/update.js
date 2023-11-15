const models = require('../../models');

const Utils = require('../../../utils');
const o = [
  'field1_name',
  'field2_name',
  'field3_name',
  'field4_name',
  'field5_name',
];
const { Facebook } = require('../push-notifications/facebook');
const { Twitter } = require('../push-notifications/twitter');
const { IncidentNotifier } = require('../push-notifications/incident-notifier');

const UpdateIncident = async (id, data, facebook_pages, twitter) => {
  try {
    const { send_push_notification } = data;
    delete data.send_push_notification;
    const incident = await models.Incident.findOne({ where: { id } });
    if (!incident) {
      return Utils.InternalRes(true, 'Incident not Found', {});
    }

    const newIncident = await incident.update({ ...data });
    if (!newIncident)
      return { error: true, message: 'Unable to save incident' };
    if (send_push_notification) {
      console.debug('send_push_notification activated. calling IncidentNotifier()');
      const notifier = new IncidentNotifier();
      const r = await notifier.createRowsInPushNotificationsTable(newIncident);
      console.debug(`createRowsInPushNotificationsTable response:`,r);
    }
    if(Array.isArray(facebook_pages) && facebook_pages.length){
      let pages = [];
      for(let p of facebook_pages){
        let tmp = String(p);
        tmp = tmp.replace(/[^0-9a-z_-]+/gi,'');
        if(tmp.length === 0 || pages.indexOf(tmp) > -1){
          continue;
        }
        pages.push(tmp);
      }
      let fb = new Facebook();
      for(const page of pages){
        let r = await fb.post_to_page(page,incident);
        console.debug(r);
      }
    }
    if(Array.isArray(twitter) && twitter.length){
      /**
       * You can only really post to a twitter profile if there's one
       * on the locality row. We purposely ignore the twitter
       * array and automatically handle it in the library
       */
      let twitterLib = new Twitter();
      let r  = await twitterLib.makePost(incident);
      console.debug(r);
    }
    global.redis.remove_incident(id);
    return Utils.InternalRes(false, 'success', {});
  } catch (err) {
    throw err;
  }
};

module.exports = UpdateIncident;
