const models = require('../../models');
const Utils = require('../../../utils');

const FindOnePOI = async id => {
  try {
    const includes = {
      include: [
        {
          model: models.Locality,
          as: 'ilocality',
          attributes: ['name'],
        },
      ],
    };
    const d = await models.ScannerFeeds.findOne({ where: { id }, ...includes });
    return Utils.InternalRes(false, 'success', d);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  title: 'FindOne',
  module: FindOnePOI,
};
