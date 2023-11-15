'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const models = require('../../models');
const sequelize = models.sequelize;
const tokenizer = require('../../../utils/tokenizer');

const adminRoles = ['super', 'admin'];
const { getToken } = require('./token');

const LoginAdmin = async (email, password) => {
  email = String(email).toLowerCase();
  const user = await models.User.findOne({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('email')),
      email
    ),
  });
  if (!user) {
    return { error: true, message: 'Wrong Credentials' };
  }
  await global.redis.refresh_user(user.id);

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return { error: true, message: 'Wrong Credentials', role: null, };
  }
  let tokenData = await getToken(user);

  // update user login time
  await models.User.update(
    {
      last_login: Date.now(),
    },
    {
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('email')),
        email
      ),
    }
  );
  return { error: false, data: tokenData, message: 'success', role: user.role, };
};

const backupDB = {
  DB: null,
  createInstance: async (force = false) => {
    const Sequelize = require('sequelize');
    let self = backupDB;
    let sequelize;
    if (!self.DB || force) {
      const creds = require('../../../config/database.js').backup;
      sequelize = new Sequelize(
        creds.database,
        creds.username,
        creds.password,
        creds
      );
      sequelize
        .authenticate()
        .then(() => {
          console.info(
            '[BACKUP DB] Database Connection has been established successfully.'
          );
        })
        .catch(err => {
          console.error('[BACKUP DB] Unable to connect to the database:', err);
        });
      self.DB = sequelize;
    }
    return self.DB;
  },
  getBackupDBUser: async email => {
    try {
      let self = backupDB;
      const DB = await self.createInstance();
      if (!DB) {
        console.error('[BACKUP DB] Unable to connect to database!');
        return null;
      }
      const r = await DB.query('select * from _user where LOWER(email)=$1', {
        bind: [String(email).toLowerCase()],
      });
      let rows = [];
      if (r && r.length) {
        rows = r[0];
      }
      for (const row of rows) {
        return row;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
    return null;
  },

  /**
   * Will copy a user's record from the backup db into the currently
   * running db. This will check if the email already exists in the current
   * db and will return an error if you try to call this function.
   *
   * Return values:
   * - If the email already exists in the current db, the return value is
   * {
   *    status: 'fail',
   *    error: true,
   *    message: 'email already exists in current db'
   * }
   * - If the email doesn't exist in the backup db, the return value is
   * {
   *    status: 'fail',
   *    error: true,
        message: 'email doesnt exist in backup db',
     }
   * - If the email was succesfully populated in the current db, the return value is
   * {
   *    status: 'success',
   *    error: false,
   *    message: 'copied'
   * }
   * - If any other issue occurred, (such as exception), the return value is
   * {
   *    status: 'error',
   *    error: true,
   *    message: 'failed',
   *    exception: {...}
   * }
   */
  copyBackupDBUserToThisDB: async email => {
    try {
      let self = backupDB;
      await self.createInstance();
      const row = await self.getBackupDBUser(email);
      if (!row) {
        return {
          status: 'fail',
          error: true,
          message: 'email doesnt exist in backup db',
        };
      }
      const exists = await self.existsInCurrentDb(email);
      if (exists) {
        return {
          status: 'fail',
          error: true,
          message: 'email already exists in current db',
        };
      }
      console.debug({row});
      const newUser = {
        first_name: row.first_name,
        last_name: row.last_name,
        phone: row.phone_number,
        email: String(email).toLowerCase(),
        password: row.password,
        title: row.title,
        role: row.role,
        subscription: row.subscription,
      };
      const result = await models.User.create(newUser);
      if (!result) {
        return {
          status: 'fail',
          error: true,
          message: 'failed to create user',
        };
      }
      return { status: 'success', error: false, message: 'copied' };
    } catch (e) {
      return { status: 'fail', error: true, message: 'failed', exception: e };
    }
  },
  existsInCurrentDb: async email => {
    try {
      email = String(email).toLowerCase();
      const user = await models.User.findOne({ where: { email } }).catch(e => {
        console.warn(e);
        return null;
      });
      if (!user) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },
  tests: {
    run: async () => {
      console.info('LoginAdmin.tests.run start');
      try {
        const assert = require('assert');
        let self = backupDB;
        await self.createInstance();
        const phil = 'phil@pioneerapplications.com';
        const invalid = 'ffffffffffffffffff019209342104921-09410924';
        let row = await self.getBackupDBUser(phil);
        assert.strictEqual(row !== null, true);
        row = await self.getBackupDBUser(invalid);
        assert.strictEqual(row, null);
        row = await self.existsInCurrentDb(phil);
        assert.strictEqual(row !== null, true);
        row = await self.existsInCurrentDb(invalid);
        assert.strictEqual(row, false);

        const TEST_EMAIL = 'test@test.com';
        let result = await self.copyBackupDBUserToThisDB(TEST_EMAIL);
        console.debug({ result });
        result = await self.copyBackupDBUserToThisDB(TEST_EMAIL);
        console.debug({ result });
      } catch (e) {
        console.error(e);
      }
      console.info('LoginAdmin.tests.run DONE');
    },
  },
};
(async () => {
  process.argv.forEach(ele => {
    if (ele.match(/^\-\-run\-login\-tests/)) {
      (async () => {
        await backupDB.tests.run();
        process.exit(0);
      })();
    }
  });
})();

LoginAdmin.copyBackupDBUserToThisDB = backupDB.copyBackupDBUserToThisDB;
module.exports = LoginAdmin;
