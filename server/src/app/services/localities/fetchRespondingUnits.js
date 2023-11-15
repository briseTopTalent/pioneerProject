'use strict';
const Utils = require('../../../utils');
const models = require('../../models');
module.exports = async id => {
  try {
    let d = await models.Incident.findAll({
      where: { locality: id },
      attributes: ['responding_units', 'locality'],
    });
    if (!d) {
      return Utils.InternalRes(false, 'Locality not Found', null);
    }
    let responding_units = {};
    for (const row of d) {
      if (Array.isArray(row.responding_units)) {
        for (const u of row.responding_units) {
          responding_units[u] = 1;
        }
      }
    }
    let incident_types = await models.PrefilledFieldOption.findAll({
      where: { locality: id },
      attributes: ['id', 'option_name'],
    });
    return Utils.InternalRes(false, 'success', {
      responding_units: Object.keys(responding_units).sort(),
      incident_types,
    });
  } catch (err) {
    throw err;
  }
};
