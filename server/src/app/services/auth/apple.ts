const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const url = require('url');
const models = require('../../models');
const { dd } = require('../../../utils');
const config = require('../../../config');
const sequelize = models.sequelize;
const tokenizer = require('../../../utils/tokenizer');
const UserService = require('../../services/user');
const { getToken } = require('./token');
const LoginAdmin = require('../../services/auth/login');
const crypto = require('crypto');

const adminRoles = ['super', 'admin'];
import { refresh as _refresh } from './token';

const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

async function getApplePublicKeys(): Promise<any> {
  const response = await axios.get('https://appleid.apple.com/auth/keys');
  return response.data.keys;
}
async function get_user(email: string): Promise<any> {
  console.debug('get_user:', email);
  email = String(email).toLowerCase();
  return await models.User.findOne({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('email')),
      email
    ),
  });
}

const loginUser = async (
  email: string,
  first_name: string,
  last_name: string,
  phone_number: string
) => {
  email = String(email).toLowerCase();
  let user: any = await models.User.findOne({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('email')),
      email
    ),
  });
  if (!user) {
    const status: any = await LoginAdmin.copyBackupDBUserToThisDB(email);
    let user_record: any = await get_user(email);
    if (!user_record) {
      const response: any = await UserService.CreateUser(
        first_name,
        last_name,
        email, // email
        phone_number, // phone
        crypto.randomBytes(32).toString('base64'), // password
        'user' // title
      );
      user_record = await models.User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('email')),
          email
        ),
      });
    }
    user = user_record;
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
  return { user, tokenData };
};

export async function verifyAppleToken(token: string): Promise<any> {
  console.log(`TOKEN: "${token}"`);
  return new Promise(async (resolve, reject) => {
    const appleKeys: any = await getApplePublicKeys();
    // Convert the keys to a format that can be used by the jsonwebtoken library
    const client: any = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    function getKey(header: any, callback: any) {
      client.getSigningKey(header.kid, function (err: any, key: any) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    }

    jwt.verify(
      token,
      getKey,
      { algorithms: ['RS256'] },
      async function (err: any, decoded: any) {
        if (err) {
          // Handle verification error
          reject({
            status: 'error',
            data: null,
            message: 'failed to verify token',
            error: err,
          });
          console.debug(JSON.stringify({ err }, null, 2));
          return;
        }
        // Token is valid, proceed with user authentication/creation
        const userId = decoded.sub;
        console.debug(JSON.stringify({ decoded }, null, 2));
        let email: any = decoded.email;
        let first_name: any = 'user';
        let last_name: any = 'user';
        let phone_number: any = '1112221234';
        let response: any = await loginUser(
          email,
          first_name,
          last_name,
          phone_number
        );
        let tokenData: any = await getToken(response.user);
        resolve(tokenData);
        return;
      }
    );
  });
}
