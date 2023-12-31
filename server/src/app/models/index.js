'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Logger = require('../../utils/logger.js');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
sequelize
  .authenticate()
  .then(() => {
    Logger.info('Database Connection has been established successfully.');
  })
  .catch(err => {
    Logger.error('Unable to connect to the database:', err);
  });

// sequelize.query = async function () {
//   try {
//     // proxy this call
//     return Sequelize.prototype.query.apply(this, arguments)
//   } catch ( err ) {
//     throw err
//   }
// }

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  //console.debug({ modelName });
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
