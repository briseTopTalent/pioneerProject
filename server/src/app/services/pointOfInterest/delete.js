const Utils = require('../../../utils');
const models = require('../../models');

const DeletePOI = async id => {
  const loc = await models.PointOfInterest.findOne({ where: { id } });
  if (!loc) return Utils.InternalRes(true, 'Point of Interest not Found', {});

  await loc.destroy();
  return Utils.InternalRes(false, 'success', {});
};
module.exports = {
  title: 'Delete',
  module: DeletePOI,
};
