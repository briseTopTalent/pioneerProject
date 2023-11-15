'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
const models = require('../models');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'SubLocality',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      // state: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: TableNames.SUBLOCALITY, underscored: true, timestamps: false }
  );
  Model.associate = function (models) {
    Model.belongsTo(models.Locality, {
      as: 'ilocality',
      foreignKey: 'locality',
    });
    // Model.hasMany(models.UserLocality, {
    //   as: "UsersLocality",
    //   foreignKey: "locality",
    // });
    // Model.hasMany(models.AdminStatus, {
    //   as: "AdminsLocality",
    //   foreignKey: "locality",
    // });
  };
  return Model;
};
