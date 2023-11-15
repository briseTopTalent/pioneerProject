'use strict';
const { v1: uuidv1 } = require('uuid');
const TableNames = require('../../database/tables');
export default (sequelize: any, DataTypes: any) => {
  const Model = sequelize.define(
    'PushNotificationsQueueLog',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      incident_id: { type: DataTypes.INTEGER, allowNull: true, },
      response_message: { type: DataTypes.TEXT, allowNull: true},
      error_message: { type: DataTypes.TEXT, allowNull: true},
      user_id_list: { type: DataTypes.TEXT, allowNull: true},
      claimed_by: { type: DataTypes.UUID, allowNull: true},
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
    },
    { tableName: TableNames.PUSH_NOTIFICATIONS_QUEUE_LOG, underscored: true, timestamps: false }
  );
  return Model;
};
