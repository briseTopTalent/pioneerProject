const models = require('../../models');
const o = [
  'field1_name',
  'field2_name',
  'field3_name',
  'field4_name',
  'field5_name',
  'locality',
];
const UpdateLocality = async (id, data) => {
  const { field1_name, field2_name, field3_name, field4_name, field5_name } =
    data;
  try {
    const locality = await models.IncidentDefinition.findOne({
      where: { locality: id },
      attributes: [...o],
    });
    if (!locality) {
      const newLocality = await models.IncidentDefinition.create({
        locality: id,
        field1_name,
        field2_name,
        field3_name,
        field4_name,
        field5_name,
      });
      if (!newLocality)
        return { error: true, message: 'Error Occurred Try Again!!!' };
      return { error: false, data: {}, message: 'success' };
    }

    const newLocality = await locality.update({
      field1_name,
      field2_name,
      field3_name,
      field4_name,
      field5_name,
    });
    if (!newLocality)
      return { error: true, message: 'Error Occurred Try Again!!!' };

    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = UpdateLocality;
