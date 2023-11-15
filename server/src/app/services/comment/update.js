const models = require('../../models');
const Utils = require('../../../utils');
const o = [
  'field1_name',
  'field2_name',
  'field3_name',
  'field4_name',
  'field5_name',
];

const UpdateComment = async (id, data) => {
  try {
    const comment = await models.Comment.findOne({ where: { id } });
    if (!comment) {
      return Utils.InternalRes(true, 'Comment not Found', {});
    }

    const updated = await comment.update({ ...data });
    if (!updated)
      return { error: true, message: 'Unable to update comment' };
    global.redis.refresh_incident_comments(comment.incident_id);

    return Utils.InternalRes(false, 'success', {});
  } catch (err) {
    throw err;
  }
};

module.exports = UpdateComment;
