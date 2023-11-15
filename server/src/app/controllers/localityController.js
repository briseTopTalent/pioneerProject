'use strict';
const LocalityService = require('../services/localities');
const { jsonFailed, jsonS } = require('../../utils');
const { Facebook } = require('../services/push-notifications/facebook');
const { Twitter } = require('../services/push-notifications/twitter');

const LocalityController = {
  FetchLocalityPushSetup: async (req, res) => {
    let response = {
      expired: [],
      pages: [],
      twitter_pages: [],
    };
    if(!req.user.is_admin){
      return jsonS(res,response,'ok',200,{});
    }
    let fb = new Facebook();
    let twitter = new Twitter();
    let fbStatus = await fb.is_locality_expired(req.params.id);
    if(fbStatus) {
      response.expired.push('fb');
    }
    let activePages = await fb.available_and_active_pages(req.params.id);
    response.pages = activePages;
    response.twitter_pages = await twitter.available_and_active_pages(req.params.id);
    return jsonS(res, response, 'ok', 200, {});
  },
  getSetup: async (req, res) => {
    let ids = [];
    if (!Array.isArray(req.query.ids)) {
      ids = [req.query.ids];
    } else {
      ids = req.query.ids;
    }
    const response = await LocalityService.GetSetup({ ids });
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  recursiveFetchAllLocalities: async (req, res) => {
    /**
     * is_admin is recognized. Does not leak twitter creds
     */
    const response = await LocalityService.RecursiveFindLocalities({is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  fetchAvailableLocalities: async (req, res) => {
    /**
     * is_admin is recognized. Does not leak twitter creds
     */
    const response = await LocalityService.FetchAvailableLocalities({is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  FetchCount: async (req, res) => {
    const response = await LocalityService.FetchCount();
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  fetchAllLocalities: async (req, res) => {
    const { page, limit } = req.query;
    const response = await LocalityService.FindAllLocalities(page, limit,{is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  FetchLocalityForUser: async (req, res) => {
    const { page, limit } = req.query;
    const response = await LocalityService.FindByUserID(
      req.params.id,
      page,
      limit,
      {is_admin: req.user.is_admin}
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  FetchLocality: async (req, res) => {
    /**
     * is_admin is recognized. Does not leak twitter creds
     */
    const { id } = req.params;
    const response = await LocalityService.FindById(id,{is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  CreateLocality: async (req, res) => {
    if (!req.user.is_admin) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const { name, state, latitude, longitude } = req.body;
    const response = await LocalityService.CreateLocality(
      name,
      state,
      latitude,
      longitude
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  UpdateLocality: async (req, res) => {
    if (!req.user.is_admin) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const response = await LocalityService.UpdateLocality(
      req.params.id,
      req.body
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  viewLocalityAdmins: async (req, res) => {
    if (!req.user.is_admin) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const { page, limit } = req.query;
    const response = await LocalityService.ViewAdmins(
      req.params.id,
      page,
      limit
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  AddAdminToLocality: async (req, res, next) => {
    if (!req.user.is_admin) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const { email } = req.body;
    const response = await LocalityService.AddAdmin(
      req.params.id,
      email,
      'sub_admin'
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  RemoveAdminToLocality: async (req, res, next) => {
    if (!req.user.is_admin) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const { email } = req.params;
    console.log('--->', email);
    const response = await LocalityService.RemoveAdmin(
      req.params.id,
      req.params.email
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  ViewAdminLocality: async (req, res) => {
    const { page, limit } = req.query;
    const response = await LocalityService.ViewAdminLocalities(
      req.params.id,
      page,
      limit,
      {is_admin: req.user.is_admin}
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  AddDefinition: async (req, res) => {
    if (!req.user.is_admin) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const response = await LocalityService.UpdateDefinition(
      req.params.id,
      req.body
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  FetchDefinition: async (req, res) => {
    const response = await LocalityService.FindDefinition(req.params.id,{is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  FetchRespondingUnits: async (req, res) => {
    const response = await LocalityService.FetchRespondingUnits(req.params.id,{is_admin: req.user.is_admin});
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};

module.exports = LocalityController;
