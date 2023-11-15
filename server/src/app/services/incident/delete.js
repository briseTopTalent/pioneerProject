const Utils = require('../../../utils');
const models = require('../../models');
const { removeRedisIncident } = require('../../../database/redis');
const userService = require('../user');

const Delete = async id => {
  const loc = await models.Incident.findOne({ where: { id } });
  if (!loc) return Utils.InternalRes(true, 'Incident not Found', {});

  await loc.destroy();
  await removeRedisIncident(id);
  return Utils.InternalRes(false, 'success', {});
};
module.exports = Delete;
