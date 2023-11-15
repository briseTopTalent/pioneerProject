'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
const models = require('../models');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'Locality',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.STRING, allowNull: false },
      subscriber_only_comments: { type: DataTypes.BOOLEAN, default: false },
      facebook_graph_token: { type: DataTypes.TEXT, allowNull: true },
      twitter_access_token: { type: DataTypes.TEXT, allowNull: true },
      twitter_access_token_secret: { type: DataTypes.TEXT, allowNull: true },
      twitter_api_key: { type: DataTypes.TEXT, allowNull: true },
      twitter_api_secret: { type: DataTypes.TEXT, allowNull: true },
      twitter_bearer_token: { type: DataTypes.TEXT, allowNull: true },
      twitter_page_name: { type: DataTypes.TEXT, allowNull: true },
      news_rss_feed_url: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: TableNames.LOCALITY, underscored: true, timestamps: false }
  );
  Model.associate = function (models) {
    Model.hasMany(models.Incident, {
      as: 'ilocality',
      foreignKey: 'locality',
    });
    Model.hasMany(models.UserLocality, {
      as: 'UsersLocality',
      foreignKey: 'locality',
    });
    Model.hasMany(models.AdminStatus, {
      as: 'AdminsLocality',
      foreignKey: 'locality',
    });
  };
  return Model;
};
