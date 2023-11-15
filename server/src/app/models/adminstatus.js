'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'AdminStatus',
    {
      _user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: '_user',
        primaryKey: true,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      role: { type: DataTypes.STRING, default: 'basic_user' },
    },
    { tableName: TableNames.ADMIN_STATUS, underscored: true, timestamps: false }
  );
  Model.associate = function (models) {
    Model.belongsTo(models.User, {
      as: 'adminRole',
      foreignKey: '_user',
    });
    Model.belongsTo(models.Locality, {
      as: 'adminLocality',
      foreignKey: 'locality',
    });
  };
  return Model;
};
