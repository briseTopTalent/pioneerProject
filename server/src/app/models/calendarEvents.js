'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'CalendarEvent',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      start_date_time: { type: DataTypes.DATE },
      end_date_time: { type: DataTypes.DATE },
      title: { type: DataTypes.TEXT },
      description: { type: DataTypes.TEXT },
      location: { type: DataTypes.TEXT },
    },
    {
      tableName: TableNames.CALENDAR_EVENT,
      underscored: true,
      timestamps: false,
    }
  );
  Model.associate = function (models) {
    Model.belongsTo(models.Locality, {
      as: 'localityData',
      foreignKey: 'locality',
    });
  };
  return Model;
};
