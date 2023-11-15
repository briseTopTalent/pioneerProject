'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
const models = require('../models');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'PointOfInterest',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.STRING, allowNull: false },
      notes: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: TableNames.POINT_OF_INTEREST,
      underscored: true,
      timestamps: false,
    }
  );
  Model.associate = function (models) {
    Model.belongsTo(models.Locality, {
      as: 'ilocality',
      foreignKey: 'locality',
    });
  };
  return Model;
};
