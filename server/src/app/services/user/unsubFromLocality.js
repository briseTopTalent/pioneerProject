'use strict';
const Utils = require('../../../utils');
const models = require('../../models');
const dd = Utils.dd

const unsubscribeFromLocality = async (
  _user,
  locality,
  sub_locality
) => {
  try {
    let body = {
      _user,
      locality,
      sub_locality,
    };
    const existing = await models.UserLocality.findAll({
      where: body,
      raw: true,
    });
    dd({existing,body,from: 'unsubscribeFromLocality'})
    if (!existing.length) {
      return Utils.InternalRes(true, 'user locality doesnt exist');
    }
    let row = await models.UserLocality.destroy({
      where: body,
    });
    return Utils.InternalRes(false, 'success', row);
  } catch (err) {
    console.error(err)
    return Utils.InternalRes(true, 'failed to find locality: ',err);
  }
};

module.exports = unsubscribeFromLocality;
