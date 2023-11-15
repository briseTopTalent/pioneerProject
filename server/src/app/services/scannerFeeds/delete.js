const Utils = require('../../../utils');
const models = require('../../models');

const DeletePOI = async id => {
  const loc = await models.ScannerFeeds.findOne({ where: { id } });
  if (!loc) return Utils.InternalRes(true, 'Scanner Field not Found', {});

  await loc.destroy();
  return Utils.InternalRes(false, 'success', {});
};
module.exports = {
  title: 'Delete',
  module: DeletePOI,
};
