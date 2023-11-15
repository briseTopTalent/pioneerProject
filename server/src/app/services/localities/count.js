const Utils = require('../../../utils');
const models = require('../../models');
const {getRedisData, }  = require('../../../database/redis');

let fetchLimit = 20,
  fetchOffset = 0;
(fetchPage = 1), (excludeColumn = ['password']);

const FetchCount = async () => {
  try {
    const total = await getRedisData(['count','localities','all',],async () => {
      return await models.Locality.count({});
    });
    const resp = { data: total };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchCount;
