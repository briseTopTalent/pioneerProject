const models = require('../../models');
const Utils = require('../../../utils');

const UpdateIncident = async (user_id, incident_id) => {
  try {
    const incident = await models.Incident.findOne({
      where: { id: incident_id },
    });
    if (!incident) {
      return Utils.InternalRes(true, 'Incident not Found', {});
    }

    try {
      const liked = await models.LikedIncidents.create({
        _user: user_id,
        incident_id,
      });
      if (!liked) return { error: true, message: `Couldn't save record` };
      await liked.save();
      return Utils.InternalRes(false, 'success', {});
    } catch (e) {
      if(e?.errors[0]?.type === 'unique violation'){
        return { error: false, message: 'Already liked'}
      }
      return { error: true, message: e };
    }
  } catch (err) {
    throw err;
  }
};

module.exports = UpdateIncident;
