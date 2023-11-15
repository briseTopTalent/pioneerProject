const { LocalityColumns } = require('../../../database/constants');
const Utils = require('../../../utils');
const models = require('../../models');

const FetchLocalityById = async id => {
  try {
    const user = await models.Locality.findOne({
      where: { id },
      attributes: [...LocalityColumns],
    });
    if (!user) {
      return Utils.InternalRes(true, 'Locality not Found', {});
    }
    return Utils.InternalRes(false, 'success', user);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchLocalityById;
