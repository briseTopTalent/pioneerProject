const Utils = require('../../../utils');
const models = require('../../models');
const { getRedisData } = require('../../../database/redis');
const o = [
  'field1_name',
  'field2_name',
  'field3_name',
  'field4_name',
  'field5_name',
];
const FetchDefinitionField = async id => {
  try {
    const incidentDefinition = await getRedisData(['locality', id, 'definitions'], async () => {
      return await models.IncidentDefinition.findOne({
        where: { locality: id },
        attributes: [...o],
      });
    });
    if (!incidentDefinition) {
      return Utils.InternalRes(false, 'Locality not Found', null);
    }
    return Utils.InternalRes(false, 'success', incidentDefinition);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchDefinitionField;
