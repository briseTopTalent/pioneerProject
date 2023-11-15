const models = require('../../models');

const Create = async data => {
  const { locality, name, url } = data;
  try {
    const d = await models.Locality.findOne({
      where: { id: locality },
      attributes: ['name'],
    });
    if (!d) return { error: true, message: "Locality Doesn't exists" };

    const newD = await models.Link.create({
      locality,
      name,
      url,
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
