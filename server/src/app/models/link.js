'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'Link',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      url: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: TableNames.LINK, underscored: true, timestamps: false }
  );
  Model.associate = function (models) {
    // Model.belongsTo(models.User, {
    //   as: "createdBy",
    //   foreignKey: "created_by",
    // });
    Model.belongsTo(models.Locality, {
      as: 'ilocality',
      foreignKey: 'locality',
    });
  };
  return Model;
};
