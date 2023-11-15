const Utils = require('../../../utils');
const models = require('../../models');
const o = [
  'field1_name',
  'field2_name',
  'field3_name',
  'field4_name',
  'field5_name',
];
const FetchDefinitionField = async id => {
  try {
    const d = await models.IncidentDefinition.findOne({
      where: { locality: id },
      attributes: [...o],
    });
    if (!d) {
      return Utils.InternalRes(false, 'Locality not Found', null);
    }
    return Utils.InternalRes(false, 'success', d);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchDefinitionField;
