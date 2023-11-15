'use strict';
const UserService = require('../services/user');
const { dd, jsonFailed, jsonS } = require('../../utils');
const config = require('../../config/');
const { Facebook } = require('../services/push-notifications/facebook');

const UserController = {
  unsubscribeFromLocality: async (req, res) => {
    const response = await UserService.UnsubscribeFromLocality(
      req.user.id,
      req.body.locality,
      req.body.sub_locality
    );

    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    global.redis.refresh_user_locality(req.user.id);
    return jsonS(res, response.data, response.message, 200, response.data);
  },
  subscribeToLocality: async (req, res) => {
    let locality =
      typeof req.body.locality !== 'undefined' ? req.body.locality : null;
    let sub_locality =
      typeof req.body.sub_locality !== 'undefined'
        ? req.body.sub_locality
        : null;
    const response = await UserService.SubscribeToLocality(
      req.user.id,
      locality,
      sub_locality
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    global.redis.refresh_user_locality(req.user.id);
    return jsonS(res, response.data, response.message, 200, response.data);
  },
  fetchUsersProfile: async (req, res) => {
    /**
     * does not leak sensitive user info
     */
    const response = await UserService.FetchUserProfile(req.user.id,{is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  SearchUser: async (req, res) => {
    /**
     * does not leak sensitive user info
     */
    const { firstName, lastName, email } = req.body;
    const response = await UserService.FetchUserByMulti(
      firstName,
      lastName,
      email,
      {is_admin: req.user.is_admin}
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  FetchCount: async (req, res) => {
    const { page, limit } = req.query;
    const response = await UserService.FetchCount();
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  fetchAllUsers: async (req, res) => {
    /**
     * does not leak sensitive user info
     */
    const { page, limit } = req.query;
    const response = await UserService.FindAllUsers(page, limit, {is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  FetchSingleUser: async (req, res) => {
    /**
     * does not leak sensitive user info
     */
    const { id } = req.params;
    const response = await UserService.FindUserByEmail(id,{is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  CreateUser: async (req, res) => {
    if(!req.user.is_admin){
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const { firstName, lastName, email, phoneNumber, role, password } =
      req.body;
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
    global.redis.refresh_user_count();
    return jsonS(res, response.data, response.message, 200, {});
  },
  CreateNonAdminUser: async (req, res) => {
    const { firstName, lastName, email, phoneNumber, title, password } =
      req.body;
    const response = await UserService.CreateUser(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      title
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    global.redis.refresh_user_count();
    return jsonS(res, response.data, response.message, 200, {});
  },
  ResetPassword: async (req, res) => {
    const response = await UserService.ResetPassword({ config, req, res });
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  EditUser: async (req, res) => {
    const { firstName, lastName, phoneNumber, role } = req.body;
    const { id } = req.params;
    /**
     * Prevents ordinary users from updating the data of other users.
     * Only admins can update other user's info
     */
    if(req.user.id != id && !req.user.is_admin){
      return jsonFailed(res, null, 'Only admins can edit other users', 400, {});
    }

    const response = await UserService.UpdateAdmin(
      id,
      firstName,
      lastName,
      phoneNumber,
      role
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    global.redis.refresh_user(id);
    return jsonS(res, response.data, response.message, 200, {});
  },
  UpdateUser: async (req, res) => {
    if (!req.user || !req.user.id) {
      return jsonFailed(
        res,
        null,
        'You must be logged in to perform this action',
        400,
        {}
      );
    }
    let firstName = null;
    let lastName = null;
    let phoneNumber = null;
    let email = null;
    let title = null;
    if (typeof req.body?.title === 'string') {
      title = req.body.title;
    }
    if (typeof req.body?.firstName === 'string') {
      firstName = req.body.firstName;
    }
    if (typeof req.body?.lastName === 'string') {
      lastName = req.body.lastName;
    }
    if (typeof req.body?.phoneNumber === 'string') {
      phoneNumber = req.body.phoneNumber;
    }
    if (typeof req.body?.email === 'string') {
      email = req.body.email;
    }
    const id = req.user.id;
    const response = await UserService.UpdateUser(
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      title
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    global.redis.refresh_user(id);
    return jsonS(res, response.data, response.message, 200, {});
  },
  saveFacebookTokens: async (req, res, next) => {
    if(!req.user){
      return jsonFailed(res, null, 'You must be logged in to do that', 400, {});
    }
    if(!req.user.is_admin){
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    try {
      let lib = new Facebook();
      let userID = req.body.userID;
      let expiresIn = req.body.expiresIn;
      let accessToken = req.body.accessToken;
      let signedRequest = req.body.signedRequest;
      let data_access_expiration_time = req.body.data_access_expiration_time;
      let localityId = parseInt(req.body.fwLocalityID,10);
      if(isNaN(localityId)){
        return jsonFailed(res, null, 'Invalid locality id', 400, {});
      }

      const response = await lib.save_tokens(req.user,localityId,userID,accessToken,expiresIn,signedRequest,data_access_expiration_time);
      return jsonS(res, response, response.message, 200, {});
    }catch(e){
      return jsonFailed(res, null, 'Unable to save token: ' + e, 400, {});
    }
  },
  ForgotPassword: async (req, res) => {
    if(!req.body?.email){
      return jsonFailed(
        res,
        null,
        `The "email" parameter is missing`,
        400,
        {}
      );
    }
    UserService.ForgotPassword(req.body.email);
    return jsonS(res, null, `A password reset email will be sent to that email if it exists in our system`, 200, {});
  },

};

module.exports = UserController;
