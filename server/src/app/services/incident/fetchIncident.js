const Utils = require('../../../utils');
const models = require('../../models');

const permissions = ['super', 'admin'];
let fetchLimit = 20,
  fetchOffset = 0;
(fetchPage = 1), (excludeColumn = ['password']);

const FetchIncident = async (
  lid,
  page = fetchPage,
  limit = fetchLimit,
  role
) => {
  let q = {};
  const includes = {
    include: [
      {
        model: models.Locality,
        as: 'ilocality',
        attributes: ['name'],
      },
      {
        model: models.User,
        as: 'createdBy',
        attributes: ['first_name', 'last_name'],
      },
    ],
  };
  try {
    if (lid) {
      const locality = await global.redis.getRedisData(['locality',lid], async () => {
        return await models.Locality.findOne({
          where: { id: lid },
          attributes: ['id', 'name'],
        });
      });
      if (!locality) return { error: true, message: "Locality doesn't exist" };
      q = {
        where: {
          locality: lid,
        },
      };
    }
    const total = await global.redis.getRedisData(['count','incident','all'],async () => {
      return await models.Incident.count({});
    });
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['created_at', 'DESC']];
    let d = [];
    if (permissions.includes(role)) {
      d = await global.redis.getRedisDataGroupBy(['incident','all','via','role',role,'offset',offset,'limit',limit,'order',order],['incident-delete','incident-update'],async () => {
        return await models.Incident.findAll({
          ...q,
          ...includes,
          attributes: { exclude: excludeColumn },
          offset,
          limit,
          order,
        });
      });
    }
    const resp = { data: d, limit, pages, page };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchIncident;
