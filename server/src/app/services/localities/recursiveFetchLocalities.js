'use strict';
const { LocalityColumns, NonAdminLocalityColumns, } = require('../../../database/constants');
const Utils = require('../../../utils');
const models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

/**
 * does not leak twitter creds
 */
const RecursiveFetchAllLocalities = async ({is_admin}) => {
  try {
    const columns = is_admin ? [...LocalityColumns] : [...NonAdminLocalityColumns];
    // TODO: getRedisData
    let results = await models.Locality.findAll({
      attributes: columns,
      raw: true,
    });
    for (let i = 0; i < results.length; i++) {
      results[i].sub_localities = [];
    }
    let id_list = {};
    for (const r of results) {
      id_list[r.id] = 1;
    }
    const subs = await models.SubLocality.findAll({
      where: {
        locality: {
          [Op.in]: Object.keys(id_list),
        },
      },
      raw: true,
    });
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < subs.length; j++) {
        if (subs[j].locality === results[i].id) {
          results[i].sub_localities.push(subs[j]);
        }
      }
    }
    return Utils.InternalRes(false, 'success', results);
  } catch (err) {
    throw err;
  }
};

module.exports = RecursiveFetchAllLocalities;
