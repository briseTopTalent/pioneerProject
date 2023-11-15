'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');

uuidv1();
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      phone_number: { type: DataTypes.STRING, allowNull: true },
      role: { type: DataTypes.STRING, default: 'basic_user' },
      verified: { type: DataTypes.BOOLEAN, default: false },
      confirmation_sent: { type: DataTypes.BOOLEAN, default: false },
      flagged: { type: DataTypes.BOOLEAN, default: false },
      feed_type: { type: DataTypes.STRING, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: true },
      push_id: { type: DataTypes.STRING, allowNull: true },
      subscription: { type: DataTypes.STRING, allowNull: true },
      last_login: { type: DataTypes.DATE, allowNull: true },
      web_token: { type: DataTypes.STRING, allowNull: true },
      refresh_token: { type: DataTypes.STRING, allowNull: true },
      reset_pw_hash: { type: DataTypes.STRING, allowNull: true },
      reset_pw_before: { type: DataTypes.STRING, allowNull: true },
      google_sso_json: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: TableNames.USERS,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'modified_at',
    }
  );
  User.associate = function (models) {
    User.hasOne(models.AdminStatus, {
      as: 'adminRole',
      foreignKey: '__user',
    });
    //User.hasMany(models.Comment, {
    //  as: "comments",
    //  foreignKey: "user_id",
    //});
    User.hasMany(models.AdminStatus, {
      as: 'UsersLocality',
      foreignKey: '__user',
    });
    User.hasMany(models.Incident, {
      as: 'createdBy',
      foreignKey: 'created_by',
    });
  };
  return User;
};
