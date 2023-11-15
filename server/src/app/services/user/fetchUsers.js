const Utils = require('../../../utils');
const models = require('../../models');
const { UserColumns, RestrictedUserColumns } = require('../../../database/constants');

let fetchLimit = 20,
  fetchOffset = 0;
(fetchPage = 1), (excludeColumn = ['password']);

const FetchUsers = async (page = fetchPage, limit = fetchLimit, {is_admin = false}) => {
  if(!is_admin){
    return Utils.InternalRes(false, 'success', {data: [],limit,pages: 0,page});
  }
  try {
    const total = await models.User.count({});
    const pages = Math.ceil(total / limit);
    offset = limit ? limit * (page - 1) : offset;
    const order = [['id', 'ASC']];
    const columns = is_admin ? [...UserColumns] : [...RestrictedUserColumns];

    const users = await models.User.findAll({
      attributes: columns,
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

module.exports = FetchUsers;
