const { exclude } = require('query-string');
const { LocalityColumns, UserColumns, } = require('../../../database/constants');
const Utils = require('../../../utils');
const models = require('../../models');

let fetchLimit = 20,
  fetchOffset = 0;
fetchPage = 1;

/**
 * This function is controlled by LocalityController.
 * This function is only called when req.user.is_admin is true
 */
const ViewAdminsBYLocality = async (
  id,
  page = fetchPage,
  limit = fetchLimit
) => {
  try {
    const loc = await models.Locality.findOne({
      where: { id },
      attributes: ['id'],
    });
    if (!loc) {
      return Utils.InternalRes(true, 'Locality not Found', {});
    }
    const q = {
      include: {
        model: models.AdminStatus,
        as: 'adminRole',
        attributes: ['locality'],
        where: {
          locality: id,
        },
      },
    };
    console.log('rrr--->', q);
    const total = await models.User.count(q);
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['id', 'ASC']];
    const users = await models.User.findAll({
      ...q,
      attributes: [...UserColumns],
      offset,
      limit,
      order,
    });
    const resp = { data: users, limit, pages, page };
    return Utils.InternalRes(false, 'success', resp);
  } catch (err) {
    throw err;
  }
};

module.exports = ViewAdminsBYLocality;
