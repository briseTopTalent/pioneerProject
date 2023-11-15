const {
  LocalityColumns,
  NonAdminLocalityColumns,
} = require('../../../database/constants');
const { getRedisData } = require('../../../database/redis');
const Utils = require('../../../utils');
const models = require('../../models');

/**
 * does not leak twitter creds
 */
const FetchLocalityById = async (id, { is_admin }) => {
  try {
    let locality = await getRedisData(['locality', id], async () => {
      return await models.Locality.findOne({
        where: { id },
        raw: true,
      });
    });
    if (!locality) {
      return Utils.InternalRes(true, 'Locality not Found', {});
    }
    for (const field of [
      'facebook_graph_token',
      'twitter_access_token',
      'twitter_access_token_secret',
      'twitter_api_key',
      'twitter_api_secret',
      'twitter_bearer_token',
    ]) {
      if (!is_admin) {
        delete locality[field];
        continue;
      }
      if (locality[field] !== null && String(locality[field]).length) {
        locality[field] = String('*').repeat(10);
      }
    }
    if (!is_admin) {
      delete locality['twitter_page_name'];
    }

    return Utils.InternalRes(false, 'success', locality);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchLocalityById;
