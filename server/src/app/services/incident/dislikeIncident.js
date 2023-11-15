const models = require('../../models');
const Utils = require('../../../utils');

const DislikeIncident = async (user_id, incident_id) => {
  try {
    const incident = await models.Incident.findOne({
      where: { id: incident_id },
    });
    if (!incident) {
      return Utils.InternalRes(true, 'Incident not Found', {});
    }

    try {
      const liked = await models.LikedIncidents.findAll({
        where: {
          _user: user_id,
          incident_id,
        },
      });
      if (!liked) return { error: true, message: `Couldn't find record` };
      if(liked.length){
        await liked[0].destroy();
      }
      return Utils.InternalRes(false, 'success', {});
    } catch (e) {
      console.log({e})
      return { error: true, message: e };
    }
  } catch (err) {
    throw err;
  }
};

module.exports = DislikeIncident;
