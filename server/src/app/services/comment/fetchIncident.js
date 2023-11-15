const Utils = require('../../../utils');
const models = require('../../models');
const { getRedisData } = require('../../../database/redis');

const permissions = ['super', 'admin'];
let fetchLimit = 20,
  fetchOffset = 0;
(fetchPage = 1), (excludeColumn = ['password']);

const FetchIncidentComments = async (
  lid,
  page = fetchPage,
  limit = fetchLimit,
  role
) => {
  let q = {};
  const includes = {
    include: [
      /*{
            model: models.Incident,
            as: "id",
            attributes: ["name"]
        },*/ {
        model: models.User,
        as: 'UserInfo',
        attributes: ['first_name', 'last_name'],
      },
    ],
  };
  try {
    if (lid) {
      const incident = await models.Incident.findOne({
        where: { id: lid },
        attributes: ['id'],
      });
      if (!incident) return { error: true, message: "Incident Doesn't exist" };
      q = {
        where: {
          incident_id: lid,
        },
        include: [models.User],
      };
    }
    const total = await getRedisData('count:comment:all', async () => {
      return await models.Comment.count({});
    }, false);
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['id', 'ASC']];
    let d = [];
    //if (permissions.includes(role)){
    d = await getRedisData('comments:incident:' + lid, async () => {
      return await models.Comment.findAll({
        ...q,
        ...includes,
        attributes: { exclude: excludeColumn },
        offset,
        limit,
        order,
      });
    }, false);
    //}
    const resp = { data: d, limit, pages, page };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
    console.log({ err });
  }
};

module.exports = FetchIncidentComments;
