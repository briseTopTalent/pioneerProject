'use strict';
const models = require('../../models');
const Utils = require('../../../utils');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

const GetByLocality = async body => {
  let localities = [];
  let sub_localities = [];
  console.log(`Localies are ${body.localities}`);
  if (typeof body.localities !== 'undefined') {
    localities = body.localities;
  }
  if (typeof body.sub_localities !== 'undefined') {
    sub_localities = body.sub_localities;
  }
  if (!Array.isArray(localities)) {
    localities = [localities];
  }
  if (!Array.isArray(sub_localities)) {
    sub_localities = [sub_localities];
  }
  let id_set = {};
  let incidents = [];
  try {
    if (localities.length) {
      let rows = await global.redis.getRedisDataGroupBy(
        ['incident', 'multi', 'via', 'locality', localities],
        ['incident-delete','locality-update'],
        async () => {
          return await models.Incident.findAll({
            where: {
              locality: {
                [Op.in]: localities,
              },
            },
            raw: true,
          });
        }
      );
      for (const r of rows) {
        incidents.push(r);
        id_set[r.id] = 1;
      }
    }
    if (sub_localities.length) {
      let rows = await global.redis.getRedisDataGroupBy(
        ['incident', 'multi', 'via', 'sub_locality', sub_localities],
        [`incident-delete`,'locality-update'],
        async () => {
          return await models.Incident.findAll({
            where: {
              sub_locality: {
                [Op.in]: sub_localities,
              },
            },
            raw: true,
          });
        }
      );
      for (const r of rows) {
        incidents.push(r);
        id_set[r.id] = 1;
      }
    }

    if (Object.keys(id_set).length > 0) {
      for (const id in id_set) {
        let [results, meta] = await global.redis.getRedisDataGroupBy(
          'count:comments:' + id,
          ['incident-delete','locality-update'],
          async () => {
            return await models.sequelize.query(
              `SELECT COUNT(id) FROM comments where incident_id=${parseInt(id)}`
            );
          }
        );
        if (results.length) {
          for (let i = 0; i < incidents.length; i++) {
            if (parseInt(incidents[i].id) === parseInt(id)) {
              incidents[i].comment_count = parseInt(results[0].count);
            }
          }
        }
      }
    }
    for (let i = 0; i < incidents.length; i++) {
      incidents[i].view_count = 0;
    }

    return Utils.InternalRes(false, 'success', {
      data: {
        incidents,
      },
    });
  } catch (err) {
    throw err;
  }
};

module.exports = GetByLocality;
