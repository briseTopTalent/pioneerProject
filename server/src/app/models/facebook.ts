const TableNames = require('../../database/tables');
export default (sequelize: any, DataTypes: any) => {
  const Model = sequelize.define(
    'Facebook',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      _user: { field: '_user', type: DataTypes.INTEGER, allowNull: false },
      locality_id: { field: 'locality_id', type: DataTypes.INTEGER, allowNull: true, },
      page_name: { field: 'page_name', type: DataTypes.TEXT, allowNull: false},
      page_id: { field: 'page_id', type: DataTypes.TEXT, allowNull: false},
      access_token: { field: 'access_token', type: DataTypes.TEXT, allowNull: false},
      fb_user_id: { field: 'fb_user_id', type: DataTypes.TEXT, allowNull: false},
      fb_original_access_token: {  field: 'fb_original_access_token', type: DataTypes.TEXT, allowNull: false},
      long_lived_access_token: { field: 'long_lived_access_token', type: DataTypes.TEXT, allowNull: true},
      long_lived_expires_in: { field: 'long_lived_expires_in', type: DataTypes.INTEGER, allowNull: true},
      expires_in: { field: 'expires_in', type: DataTypes.INTEGER, allowNull: true, },
      expiration_time: { field: 'expiration_time', type: DataTypes.INTEGER, allowNull: true, },
      signed_request: { field: 'signed_request', type: DataTypes.TEXT, allowNull: true, },
      response_message: { field: 'response_message', type: DataTypes.TEXT, allowNull: true},
      error_message: { field: 'error_message', type: DataTypes.TEXT, allowNull: true},
      active: { field: 'active', type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true},
      created_at: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
      },
    },
    { tableName: TableNames.FACEBOOK, underscored: true, timestamps: false }
  );
  return Model;
};
