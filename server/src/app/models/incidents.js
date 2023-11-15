'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'Incident',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      sub_locality: { type: DataTypes.INTEGER },
      created_by: { type: DataTypes.INTEGER },
      latitude: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: true },
      field1_value: { type: DataTypes.TEXT },
      field2_value: { type: DataTypes.TEXT },
      field3_value: { type: DataTypes.TEXT },
      field4_value: { type: DataTypes.TEXT },
      field5_value: { type: DataTypes.TEXT },
      responding_units: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
      featured: { type: DataTypes.BOOLEAN, default: false },
      sfeatured_image_url: { type: DataTypes.STRING, allowNull: true },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
    },
    { tableName: TableNames.INCIDENT, underscored: true, timestamps: false }
  );
  Model.associate = function (models) {
    Model.belongsTo(models.User, {
      as: 'createdBy',
      foreignKey: 'created_by',
    });
    Model.belongsTo(models.Locality, {
      as: 'ilocality',
      foreignKey: 'locality',
    });
    Model.belongsTo(models.SubLocality, {
      as: 'iSlocality',
      foreignKey: 'sub_locality',
    });
  };
  return Model;
};
