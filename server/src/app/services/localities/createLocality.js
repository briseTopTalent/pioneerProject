const models = require('../../models');
const { removeFromRedisMulti } = require('../../../database/redis');

const CreateLocality = async (name, state, latitude, longitude) => {
  try {
    const locality = await models.Locality.findOne({ where: { name, state } });
    if (locality) return { error: true, message: 'Locality already exists' };

    const newLocality = await models.Locality.create({
      name,
      state,
      latitude,
      longitude,
    });
    await removeFromRedisMulti([
      ['count', 'localities', 'all'],
      ['localities', 'all', 'is_admin', true],
      ['localities', 'all', 'is_admin', false],
    ]);

    if (!newLocality)
      return { error: true, message: 'Unable to create locality' };

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = CreateLocality;
