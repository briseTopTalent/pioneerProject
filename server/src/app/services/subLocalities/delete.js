const Utils = require('../../../utils');
const models = require('../../models');

const Delete = async id => {
  const loc = await models.SubLocality.findOne({ where: { id } });
  if (!loc) return Utils.InternalRes(true, 'Sub Locality not Found', {});

  await loc.destroy();
  return Utils.InternalRes(false, 'success', {});
};
module.exports = {
  title: 'Delete',
  module: Delete,
};
