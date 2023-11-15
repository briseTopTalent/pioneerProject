const models = require('../../models');
const Utils = require('../../../utils');

const UpdatePOI = async (id, data) => {
  try {
    const locality = await models.ScannerFeeds.findOne({ where: { id } });
    if (!locality) {
      return Utils.InternalRes(true, 'Scanner Feed not Found', {});
    }

    const newLocality = await locality.update({ ...data });
    if (!newLocality)
      return { error: true, message: 'Error Occurred Try Again!!!' };

    return Utils.InternalRes(false, 'success', {});
  } catch (err) {
    throw err;
  }
};

module.exports = {
  title: 'Update',
  module: UpdatePOI,
};
