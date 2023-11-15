'use strict';
const Utils = require('../../../utils');
const models = require('../../models');

const Remove = async (user, id) => {
  const notification = await models.Notifications.findOne({
    where: { id, _user: user.id },
  });
  if (!notification) {
    return Utils.InternalRes(true, 'Notification not Found', {});
  }

  const removeStatus = await models.Notifications.destroy({
    where: {
      _user: user.id,
      id,
    },
  });
  return {
    error: false,
    data: { removeStatus, user_id: user.id },
    message: 'success',
  };
};
module.exports = Remove;
