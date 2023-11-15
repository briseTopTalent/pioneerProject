'use strict';
const models = require('../../models');

const Comment = async (userId, data) => {
  const comment = data.comment
  const incidentID = data.incidentID
  const img = data.img

  try {
    const d = await global.redis.getRedisData(['incident',incidentID],async () => {
        return await models.Incident.findOne({
        where: { id: incidentID },
      });
    });
    if (!d) {
      return { error: true, message: 'Incident doesnt exist' };
    }

    let icom = await models.Comment.create({
      user_id: userId,
      incident_id: incidentID,
      comment:comment,
      img:img
    });
    global.redis.refresh_incident_comments(incidentID);
    return { error: false, data: icom, message: 'created comment' };
  } catch (err) {
    throw err;
  }
};

module.exports = Comment;
