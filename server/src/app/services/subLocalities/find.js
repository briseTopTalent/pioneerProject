const Utils = require('../../../utils');
const models = require('../../models');
let fetchLimit = 20,
  fetchOffset = 0;
fetchPage = 1;
// excludeColumn = ["id", "locality", "name", "state", "latitude", "longitude"];

const FindAll = async (lid, page = fetchPage, limit = fetchLimit) => {
  let q = {};
  const includes = {
    include: [
      {
        model: models.Locality,
        as: 'ilocality',
        attributes: ['name'],
      },
    ],
  };
  try {
    if (lid) {
      const locality = await models.Locality.findOne({
        where: { id: lid },
        attributes: ['id', 'name'],
      });
      if (!locality) return { error: true, message: "Locality Doesn't exists" };
      q = {
        where: {
          locality: lid,
        },
      };
    }
    console.log(lid, q);
    const total = await models.SubLocality.count({ ...q });
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['id', 'ASC']];
    let d = await models.SubLocality.findAll({
      ...q,
      ...includes,
      offset,
      limit,
      order,
    });
    const resp = { data: d, limit, pages, page };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
  }
};
module.exports = {
  title: 'FindAll',
  module: FindAll,
};