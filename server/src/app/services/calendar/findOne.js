const models = require('../../models');
const Utils = require('../../../utils');

const FindOne = async id => {
  try {
    const includes = {
      include: [
        {
          model: models.Locality,
          as: 'localityData',
          attributes: ['name'],
        },
      ],
    };
    const d = await models.CalendarEvent.findOne({
      where: { id },
      ...includes,
    });
    return Utils.InternalRes(false, 'success', d);
  } catch (err) {
    throw err;
  }
};

module.exports = FindOne;
