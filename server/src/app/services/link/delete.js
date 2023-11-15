const Utils = require('../../../utils');
const models = require('../../models');

const Delete = async id => {
  const loc = await models.Link.findOne({ where: { id } });
  if (!loc) return Utils.InternalRes(true, 'Scanner Field not Found', {});

  await loc.destroy();
  return Utils.InternalRes(false, 'success', {});
};
module.exports = {
  title: 'Delete',
  module: Delete,
};
