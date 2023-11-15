const models = require('../../models');

const Create = async (userId, data) => {
  let {
    locality,
    title,
    description,
    location,
    start_date_time,
    end_date_time,
  } = data;
  try {
    if (end_date_time != '' && start_date_time > end_date_time) {
      return {
        error: true,
        message: "start date can't be greater than end date",
      };
    }
    if (end_date_time == '') {
      end_date_time = null;
    }
    const d = await models.Locality.findOne({
      where: { id: locality },
      attributes: ['name'],
    });
    if (!d) return { error: true, message: "Locality not found" };

    const newD = await models.CalendarEvent.create({
      locality,
      title,
      description,
      location,
      start_date_time,
      end_date_time,
    });

    if (!newD) return { error: true, message: 'Could not create calendar event' };

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = Create;
