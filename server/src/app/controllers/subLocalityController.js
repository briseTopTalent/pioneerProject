const Service = require('../services/subLocalities');
const { jsonFailed, jsonS } = require('../../utils');

const POIController = {
  findAll: async (req, res) => {
    const { locality, page, limit } = req.query;
    const response = await Service.FindAll(locality, page, limit);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  FindOne: async (req, res) => {
    const response = await Service.FindOne(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  Create: async (req, res) => {
    if (!['admin', 'super'].includes(req.user.role)) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const response = await Service.Create(req.body);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  Update: async (req, res) => {
    if (!['admin', 'super'].includes(req.user.role)) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const response = await Service.Update(req.params.id, req.body);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  Delete: async (req, res) => {
    if (!['admin', 'super'].includes(req.user.role)) {
      return jsonFailed(
        res,
        null,
        'You do not have the correct permissions.',
        400,
        {}
      );
    }
    const response = await Service.Delete(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};

module.exports = POIController;
