'use strict';
const Utils = require('../../../utils');
const models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const {
  UserColumns,
  RestrictedUserColumns,
} = require('../../../database/constants');

let excludeColumn = ['password'];

const FetchUserProfile = async (id, { is_admin = false }) => {
  try {
    const columns = is_admin
      ? [...UserColumns]
      : ['phone_number', ...RestrictedUserColumns];
    let user = await global.redis.getRedisData(
      ['user', id, 'is_admin', is_admin],
      async () => {
        return await models.User.findOne({
          where: { id },
          attributes: columns,
          raw: true,
        });
      }
    );

    if (!user) {
      return Utils.InternalRes(true, 'User not Found', {});
    }

    let localities = await global.redis.getRedisData(
      ['user', id, 'locality', 'subscription'],
      async () => {
        return await models.sequelize.query(
          `select * from user_locality_subscription WHERE _user=${id}`,
          {
            type: models.sequelize.QueryTypes.SELECT,
          }
        );
      }
    );

    user.localities = localities;
    return Utils.InternalRes(false, 'success', user);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchUserProfile;
