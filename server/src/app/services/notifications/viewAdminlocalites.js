const { exclude } = require('query-string');
const { LocalityColumns } = require('../../../database/constants');
const userService = require('../user');
const Utils = require('../../../utils');
const models = require('../../models');

let fetchLimit = 20,
  fetchOffset = 0;
fetchPage = 1;
const SuperAdmins = ['super', 'admin'];
const ViewL = async (id, page = fetchPage, limit = fetchLimit) => {
  try {
    const user = await userService.FindUserByEmail(id, {is_admin: true});
    if (user.error) return { error: true, message: 'Invalid Email' };
    const q = SuperAdmins.includes(user.data.role)
      ? {}
      : {
          include: {
            model: models.AdminStatus,
            as: 'AdminsLocality',
            attributes: ['_user'],
            where: {
              _user: user.data.id,
            },
          },
        };
    // console.log("rrr--->", q);
    const total = await models.Locality.count(q);
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['id', 'ASC']];
    const users = await models.Locality.findAll({
      ...q,
      attributes: ['id', 'name'],
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

module.exports = ViewL;
