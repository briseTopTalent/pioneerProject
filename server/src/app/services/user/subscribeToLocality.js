'use strict';
const Utils = require('../../../utils');
const models = require('../../models');

const FetchUserProfile = async (user_id, locality_id, sub_locality = null) => {
  try {
    let body = {
      _user: user_id,
    };
    if (locality_id !== null) {
      body.locality = locality_id;
    }
    if (sub_locality !== null) {
      body.sub_locality = sub_locality;
    }
    const existing = await models.UserLocality.findAll({
      where: body,
      raw: true,
    });
    if (existing.length) {
      return Utils.InternalRes(true, 'locality subscription already exists');
    }
    let row = await models.UserLocality.create({
      _user: user_id,
      locality: locality_id,
      sub_locality,
    });
    return Utils.InternalRes(false, 'success', row.dataValues);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchUserProfile;
