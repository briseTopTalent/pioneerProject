const Utils = require('../../../utils');
const models = require('../../models');

const Fetch = async user => {
  try {
    const notifications = await models.Notifications.findAll({
      attributes: [
        'id',
        '_user',
        'notification_type',
        'notification_id',
        'created_at',
        'updated_at',
      ],
      where: {
        _user: user.id,
      },
    });
    const resp = { data: notifications };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
  }
};

module.exports = Fetch;
