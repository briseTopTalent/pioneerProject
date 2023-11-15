const models = require('../../models');
const {
  insertRedisData,
  getRedisData,
  removeFromRedis,
  removeRedisLocality,
} = require('../../../database/redis');

/**
 * This method is controlled by LocalityController and is only called
 * if req.user.is_admin is true
 */
const UpdateLocality = async (id, data) => {
  try {
    const locality = await models.Locality.findOne({
      attributes: ['id'],
      where: { id },
    });
    if (!locality) {
      console.error(`Unable to find locality: `,id,{data});
      return { error: true, message: 'Unable to find locality' };
    }

    for (const field of [
      'twitter_access_token',
      'twitter_access_token_secret',
      'twitter_api_key',
      'twitter_api_secret',
      'twitter_bearer_token',
    ]) {
      if (data[field] && data[field].length === 10 && data[field][0] === '*') {
        delete data[field];
      }
    }
    const newLocality = await locality.update({ ...data });
    if (!newLocality){
      console.error(`Unable to update locality`);
      return { error: true, message: 'Unable to update locality' };
    }
    await removeRedisLocality(id);

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = UpdateLocality;
