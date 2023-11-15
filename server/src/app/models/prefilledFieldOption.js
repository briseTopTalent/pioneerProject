'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'PrefilledFieldOption',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      field_number: { type: DataTypes.INTEGER },
      option_name: { type: DataTypes.TEXT },
    },
    {
      tableName: TableNames.PREFILLED_FIELD_OPTION,
      underscored: true,
      timestamps: false,
    }
  );
  return Model;
};
