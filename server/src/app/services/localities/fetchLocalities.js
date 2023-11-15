const {
  LocalityColumns,
  NonAdminLocalityColumns,
} = require('../../../database/constants');
const Utils = require('../../../utils');
const models = require('../../models');
const { getRedisData } = require('../../../database/redis');

let fetchLimit = 20,
  fetchOffset = 0;
fetchPage = 1;

const FetchLocalities = async (
  page = fetchPage,
  limit = fetchLimit,
  { is_admin = false }
) => {
  try {
    const columns = is_admin
      ? [...LocalityColumns]
      : [...NonAdminLocalityColumns];
    const total = await getRedisData(
      ['count', 'localities','all'],
      async () => {
        return await models.Locality.count({});
      }
    );
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['id', 'ASC']];
    const users = await getRedisData(
      ['localities', 'all', 'is_admin', is_admin],
      async () => {
        return await models.Locality.findAll({
          attributes: columns,
          offset,
          limit,
          order,
        });
      }
    );
    const resp = { data: users, limit, pages, page };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchLocalities;
