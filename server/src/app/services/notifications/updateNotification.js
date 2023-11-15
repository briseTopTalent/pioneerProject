'use strict';
const models = require('../../models');

const Update = async (user, id, data) => {
  try {
    const existing = await models.Notifications.findOne({
      where: { id, _user: user.id },
    });
    if (!existing) {
      return { error: true, message: `Notification doesn't exist` };
    }

    let extracted = {};
    if (typeof data.notification_type !== 'undefined') {
      extracted.notification_type = data.notification_type;
    }
    if (typeof data.notification_id !== 'undefined') {
      extracted.notification_id = data.notification_id;
    }
    const notification = await existing.update(extracted);
    if (!notification) {
      return { error: true, message: 'Couldnt update record' };
    }

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = Update;
