const conf = require('./get').fetch();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: 0,
    ssl: process.env.DB_SSL,
    port: process.env.DB_PORT ?? 5432,
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: 0,
    ssl: process.env.DB_SSL,
    port: process.env.DB_PORT ?? 5432,
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: 0,
    ssl: process.env.DB_SSL,
    port: process.env.DB_PORT ?? 5432,
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL,
        rejectUnauthorized: false,
      },
    },
  },
  backup: {
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASS,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: 'postgres',
    operatorsAliases: 0,
    ssl: process.env.PROD_DB_SSL,
    port: process.env.PROD_DB_PORT ?? 5432,
    dialectOptions: {
      ssl: {
        require: process.env.PROD_DB_SSL,
        rejectUnauthorized: false,
      },
    },
  },
};
