'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'PrefilledLocalityUnit',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      unit_name: { type: DataTypes.TEXT },
    },
    {
      tableName: TableNames.PREFILLED_LOCALITY_UNIT,
      underscored: true,
      timestamps: false,
    }
  );
  return Model;
};
