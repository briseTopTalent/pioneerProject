const models = require('../../models');

const CreateNotification = async (user, notification_type, notification_id) => {
  try {
    const newNotification = await models.Notifications.create({
      _user: user.id,
      notification_type,
      notification_id,
    });

    if (!newNotification) return { error: true, message: 'Unable to create.' };

    return { error: false, data: { newNotification }, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = CreateNotification;
