const Utils = require('../../../utils');
const models = require('../../models');

let fetchLimit = 20,
  fetchOffset = 0;
(fetchPage = 1), (excludeColumn = ['password']);

const FetchCount = async () => {
  try {
    const total = await global.redis.getRedisData(['count','users'], async () => {
      return await models.User.count({});
    });
    const resp = { data: total };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchCount;
