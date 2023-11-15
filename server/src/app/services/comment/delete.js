const Utils = require('../../../utils');
const models = require('../../models');
const { removeFromRedis } = require('../../../database/redis');
const userService = require('../user');

const Delete = async id => {
  const comment = await models.Comment.findOne({ where: { id } });
  if (!comment) return Utils.InternalRes(true, 'Comment not Found', {});

  global.redis.refresh_incident_comments(comment.incident_id);
  await comment.destroy();
  return Utils.InternalRes(false, 'success', {});
};
module.exports = Delete;
