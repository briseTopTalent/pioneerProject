'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'IncidentDefinition',
    {
      locality: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      field1_name: { type: DataTypes.TEXT },
      field2_name: { type: DataTypes.TEXT },
      field3_name: { type: DataTypes.TEXT },
      field4_name: { type: DataTypes.TEXT },
      field5_name: { type: DataTypes.TEXT },
    },
    {
      tableName: TableNames.INCIDENT_DEFINITION,
      underscored: true,
      timestamps: false,
    }
  );
  return Model;
};
