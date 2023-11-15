const models = require('../../models');
const Utils = require('../../../utils');
const o = [
  'field1_name',
  'field2_name',
  'field3_name',
  'field4_name',
  'field5_name',
];

const Update = async (id, data) => {
  try {
    const d = await models.CalendarEvent.findOne({ where: { id } });
    if (!d) {
      return Utils.InternalRes(true, 'Event not Found', {});
    }

    const newD = await d.update({ ...data });
    if (!newD) return { error: true, message: 'Could not update calendar event' };

    return Utils.InternalRes(false, 'success', {});
  } catch (err) {
    throw err;
  }
};

module.exports = Update;
