const Utils = require('../../../utils');
const models = require('../../models');
const userService = require('../user');

const Delete = async id => {
  const loc = await models.CalendarEvent.findOne({ where: { id } });
  if (!loc) return Utils.InternalRes(true, 'Event not Found', {});

  await loc.destroy();
  return Utils.InternalRes(false, 'success', {});
};
module.exports = Delete;
