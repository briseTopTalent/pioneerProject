const Utils = require('../../../utils');
const models = require('../../models');
const { Op } = require('sequelize');
const { UserColumns, RestrictedUserColumns } = require('../../../database/constants');

let excludeColumn = ['password'];

const FetchUserByEmail = async (fname, lname, email,{is_admin = false}) => {
  if(!is_admin){
    return Utils.InternalRes(true, 'Permission denied', {});
  }
  try {
    let where = {};
    if (fname) {
      where.first_name = { [Op.iLike]: `%${fname}%` };
    }
    if (lname) {
      where.last_name = { [Op.iLike]: `%${lname}%` };
    }
    if (email) {
      where.email = { [Op.iLike]: `%${email}%` };
    }
    const columns = is_admin ? [...UserColumns] : [...RestrictedUserColumns];
    const user = await models.User.findAll({
      where,
      attributes: columns,
    });
    if (!user) {
      return Utils.InternalRes(true, 'User not Found', {});
    }
    return Utils.InternalRes(false, 'success', user);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchUserByEmail;
