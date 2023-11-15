'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
const models = require('../models');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'Notifications',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      _user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: '_user',
        primaryKey: false,
      },
      notification_type: { type: DataTypes.STRING, allowNull: false },
      notification_id: { type: DataTypes.STRING, allowNull: false },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
    },
    { tableName: TableNames.NOTIFICATIONS, underscored: true, timestamps: true }
  );
  return Model;
};
