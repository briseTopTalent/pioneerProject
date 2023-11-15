'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
uuidv1();
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: TableNames.USER_ROLE, underscored: true, timestamps: false }
  );
  return UserRole;
};
