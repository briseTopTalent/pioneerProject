'use strict';
const UserService = require('../services/user');
const { jsonFailed, jsonS } = require('../../utils');
const { LoginAdmin, Google, Refresh, Apple } = require('../services/auth');
const { xt } = require('@mentoc/xtract');
const config = require('../../config');
const fblogin = require('../services/push-notifications/facebook-login');
const dd = (...args) => {
  console.debug(JSON.stringify([...args], null, 2));
};

const AuthController = {
  verifyApple: (req, res) => {
    console.log('Verifying apple token...');

    let { token } = req.body;

    Apple.verifyAppleToken(token)
      .then((response) => {
        return jsonS(res, response, response.message, 200, {});
      })
      .catch(issue => {
        return jsonFailed(res, null, 'Unable to verify apple token', 400, {});
      });
  },
  login: async (req, res) => {
    console.log('Logging In...');

    let { email, password } = req.body;
    if (!email || !password) {
      return jsonFailed(res, null, 'Missing email or password', 400, {});
    }

    email = String(email).toLowerCase();
    let responseCopy = await LoginAdmin.copyBackupDBUserToThisDB(email);
    console.debug({copyBackupDBUserToThisDB: responseCopy});
    let response = await LoginAdmin(email, password);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    let referer = req.headers?.referer;
    if(referer && String(referer).toLowerCase().match(/auth\/login/) && !['super','admin'].includes(response.role)){
      return jsonFailed(res, null, 'Permission denied', 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  refreshToken: async (req, res) => {
    console.log('Refreshing token...');

    const token = req.body.token;

    let response = await Refresh.refresh(token);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  createNewAdmin: async (req, res) => {
    let { firstName, lastName, email, password, phoneNumber, role } = req.body;
    email = String(email).toLowerCase();
    const response = await UserService.CreateAdmin(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response, response.message, 200, {});
  },
  googleOAuth: async (req, res, next) => {
    /**
     * This endpoint simply dumps the authenticated oauth2 url to the user.
     * this URL will then allow the user to sign in using their google account
     */
    let response = await Google.generate_auth_url();
    return jsonS(res, response, response.message, 200, {});
  },
  sso: async (req, res, next) => {
    /*
     * This function is the redirect_uri for the google oauth2 workflow.
     * If the passed in token is good, then we can authenticate them with
     * our system.
     */
    let response = await Google.parse_params(req);
    if (response.error) {
      return res.redirect('/auth/login?issue=1');
    }
    return res.redirect(
      '/auth/login?login_now=1&token=' + String(response.token)
    );
  },
  loginSso: async (req, res, next) => {
    let response = await Google.get_token(req.query.token);
    let referer = req.headers?.referer;
    if(referer && String(referer).toLowerCase().match(/auth\/login/) && !['super','admin'].includes(response.role)){
      return jsonFailed(res, null, 'Permission denied', 400, {});
    }
    return jsonS(res, response, response.message, 200, {});
  },
  facebookAppId: async (req, res, next) => {
    return jsonS(res, { data: config.FB_APP_ID }, config.FB_APP_ID, 200, {});
  },
};

module.exports = AuthController;
