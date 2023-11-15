'use strict';
const TableNames = require('../../database/tables');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'LikedIncidents',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      incident_id: { field: 'incident_id', type: DataTypes.INTEGER, allowNull: false },
      _user: { type: DataTypes.INTEGER, allowNull: false, field: '_user', },
    },
    { tableName: TableNames.LIKED_INCIDENTS, underscored: true, timestamps: false }
  );
  return Model;
};
