const models = require('../../models');

const CreatePOI = async data => {
  const { locality, name, address, latitude, longitude, notes } = data;
  try {
    const d = await models.Locality.findOne({
      where: { id: locality },
      attributes: ['name'],
    });
    if (!d) return { error: true, message: "Locality Doesn't exists" };

    const newD = await models.PointOfInterest.create({
      locality,
      name,
      address,
      latitude,
      longitude,
      notes,
    });

    if (!newD) return { error: true, message: 'Error Occurred Try Again!!!' };

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  title: 'Create',
  module: CreatePOI,
};
