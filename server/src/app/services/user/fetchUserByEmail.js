const Utils = require('../../../utils');
const models = require('../../models');
const { UserColumns, RestrictedUserColumns } = require('../../../database/constants');

const sequelize = require('../../models').sequelize;

let excludeColumn = ['password'];

const FetchUserByEmail = async (email,{is_admin = false}) => {
  try {
    email = String(email).toLowerCase();
    const columns = is_admin ? [...UserColumns] : [...RestrictedUserColumns];
    const user = await global.redis.getRedisData(['user','via','email',email,'is_admin',is_admin], async () => {
      return await models.User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('email')),
          email
        ),
        attributes: columns, 
      });
    });
    if (!user) {
      return Utils.InternalRes(true, 'User not Found', {});
    }
    return Utils.InternalRes(false, 'success', user);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = FetchUserByEmail;
