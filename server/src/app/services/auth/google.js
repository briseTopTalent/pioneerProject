'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const url = require('url');
const models = require('../../models');
const { dd } = require('../../../utils');
const config = require('../../../config');
const sequelize = models.sequelize;
const tokenizer = require('../../../utils/tokenizer');
const LoginAdmin = require('../../services/auth/login');
const UserService = require('../../services/user');
const crypto = require('crypto');
const { getToken } = require('./token');

const keys = {
  client_id: process.env.GOOGLE_SIGN_ON_CLIENT_ID,
  client_secret: process.env.GOOGLE_SIGN_ON_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_SIGN_ON_REDIRECT_URI,
};
const SCOPES = [
  'https://www.googleapis.com/auth/profile.emails.read',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
const adminRoles = ['super', 'admin'];
async function get_user(email) {
  console.debug('get_user:', email);
  email = String(email).toLowerCase();
  return await models.User.findOne({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('email')),
      email
    ),
  });
}
/**
 * Start by acquiring a pre-authenticated oAuth2 client.
 */
async function generate_auth_url() {
  // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
  // which should be downloaded from the Google Developers Console.
  const oAuth2Client = new OAuth2Client(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uri
  );

  // Generate the url that will be used for the consent dialog.
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

async function parse_params(req) {
  const oAuth2Client = new OAuth2Client(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uri
  );

  const qs = new URL(req.url, `https://${config.SERVER_URL}`).searchParams;
  const code = qs.get('code');
  console.log(`Code is ${code}`);

  let email = '';
  // Now that we have the code, use that to acquire tokens.
  try {
    const r = await oAuth2Client.getToken(code);
    dd({ r });
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: r.tokens.id_token,
      audience: keys.client_id,
    });
    let payload = ticket.getPayload();
    if (!payload['email']) {
      return {
        status: 'error',
        error: 'Please allow the application to view your email address',
      };
    }
    dd({ payload });
    email = String(payload['email']).toLowerCase();
    let user_record = await get_user(email);
    const role = '';
    const phone_number = '';
    if (!user_record) {
      const status = await LoginAdmin.copyBackupDBUserToThisDB(email);
      user_record = await get_user(email);
    }
    if (!user_record) {
      console.debug('user');
      // Create user
      const response = await UserService.CreateUser(
        payload['given_name'], // first_name
        payload['family_name'], // last_name
        email, // email
        phone_number, // phone
        crypto.randomBytes(32).toString('base64'), // password
        role // title
      );
      if (response.error) {
        return { status: 'error', error: response.error, response };
      }
      user_record = await get_user(email);
    }
    payload.firewire = {
      tokens: r.tokens,
    };
    console.debug('constructing user');
    const user = {
      id: user_record.id,
      email,
      verified: payload['email_verified'],
      role,
    };
    await global.redis.refresh_user(user.id);
    const tokenData = await getToken(user);

    // update user login time
    let u_ret = await models.User.update(
      {
        last_login: Date.now(),
        google_sso_json: JSON.stringify(payload),
      },
      {
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('email')),
          email
        ),
      }
    );
    return {
      u_ret,
      status: 'ok',
      data: tokenData,
      message: 'success',
      op: 'existing',
      payload,
      email,
      token: tokenData.token,
    };
  } catch (e) {
    console.error(`Couldn't get profile info:`, e, JSON.stringify(e, null, 2));
    return {
      status: 'error',
      error: 'Unable to get profile data',
      exception: e,
      email,
    };
  }
}

async function get_token(token) {
  let user_record = await jwt.verify(token, config.JWT_SECRET);
  if (!('email' in user_record)) {
    dd('couldnt find user record');
    return { error: true, data: null, message: 'failed to find user' };
  }
  let email = String(user_record.email).toLowerCase();
  user_record = await get_user(email);
  await global.redis.refresh_user(user_record.id);
  return await getToken(user_record);
}
module.exports = {
  parse_params,
  generate_auth_url,
  get_token,
};
