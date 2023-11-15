'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
export default (sequelize: any, DataTypes: any) => {
  const Model = sequelize.define(
    'PushNotifications',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      _user: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        field: '_user',
      },
      incident_id: { type: DataTypes.INTEGER, allowNull: false, },
      claimed_by: { type: DataTypes.UUID, allowNull: true, },
      sent_at: { type: DataTypes.DATE, allowNull: true, },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
    },
    { tableName: TableNames.PUSH_NOTIFICATIONS, underscored: true, timestamps: false }
  );
  return Model;
};
