const models = require('../../models');

const Create = async data => {
  const { locality, name, state, latitude, longitude } = data;
  try {
    const d = await models.Locality.findOne({
      where: { id: locality },
      attributes: ['name'],
    });
    if (!d) return { error: true, message: "Locality Doesn't exists" };

    const newD = await models.SubLocality.create({
      locality,
      name,
      state,
      latitude,
      longitude,
    });

    if (!newD) return { error: true, message: 'Error Occurred Try Again!!!' };

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  title: 'Create',
  module: Create,
};
