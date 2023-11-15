'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
const models = require('../models');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'Comment',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
      user_id: { allowNull: false, type: DataTypes.INTEGER },
      comment: { type: DataTypes.TEXT, allowNull: false },
      img: { type: DataTypes.TEXT, allowNull: true },
      incident_id: { allowNull: false, type: DataTypes.INTEGER },
    },
    { tableName: TableNames.COMMENTS, underscored: true, timestamps: false }
  );
  Model.associate = function (models) {
    Model.belongsTo(models.User, {
      as: 'UserInfo',
      foreignKey: 'user_id',
    });
  };
  return Model;
};
