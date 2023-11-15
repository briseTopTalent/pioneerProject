const { exclude } = require('query-string');
const { LocalityColumns } = require('../../../database/constants');
const userService = require('../user');
const Utils = require('../../../utils');
const models = require('../../models');

let fetchLimit = 20,
  fetchOffset = 0;
fetchPage = 1;
const SuperAdmins = ['super', 'admin'];
const ViewAdminLocalities = async (id, page = fetchPage, limit = fetchLimit, {is_admin = false}) => {
  try {
    const user = await global.redis.getRedisData(['user','via','email',id,'is_admin',is_admin],async () => {
      return await userService.FindUserByEmail(id, {is_admin});
    });
    if (user.error) return { error: true, message: 'Unable to find email' };
    const total = await models.Locality.count();
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['id', 'ASC']];
    const users = await models.Locality.findAll({
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

module.exports = ViewAdminLocalities;
