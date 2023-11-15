'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'UserLocality',
    {
      _user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: '_user',
        primaryKey: false,
      },
      locality: { type: DataTypes.INTEGER, allowNull: false },
      sub_locality: { type: DataTypes.INTEGER },
    },
    {
      tableName: TableNames.USER_LOCALITY,
      underscored: true,
      timestamps: false,
    }
  );
  Model.associate = function (models) {
    Model.belongsTo(models.Locality, {
      as: 'UsersLocality',
      foreignKey: 'locality',
    });
  };
  return Model;
};
