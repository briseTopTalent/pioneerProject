const models = require('../../models');
const { removeFromRedis } = require('../../../database/redis');

const CreateComment = async (user_id, data) => {
  const { comment, incident_id } = data;
  try {
    const d = await models.Incident.findOne({
      where: { id: incident_id },
      attributes: ['id'],
    });
    if (!d) return { error: true, message: "Incident doesn't exist" };

    const newD = await models.Comment.create({
      user_id,
      comment,
      incident_id,
    });
    global.redis.refresh_incident_comments(incident_id);

    if (!newD) return { error: true, message: 'Error Occurred Try Again!!!' };

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = CreateComment;
