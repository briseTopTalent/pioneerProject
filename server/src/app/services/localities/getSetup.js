'use strict';
const Utils = require('../../../utils');
const models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

const GetSetup = async body => {
  const { ids } = body;
  try {
    const feeds = await models.ScannerFeeds.findAll({
      where: {
        locality: {
          [Op.in]: ids,
        },
      },
      raw: true,
    });
    const definitions = await models.IncidentDefinition.findAll({
      where: {
        locality: {
          [Op.in]: ids,
        },
      },
      raw: true,
    });
    const links = await models.Link.findAll({
      where: {
        locality: {
          [Op.in]: ids,
        },
      },
      raw: true,
    });
    return Utils.InternalRes(false, 'success', { feeds, definitions, links });
  } catch (err) {
    throw err;
  }
};

module.exports = GetSetup;
