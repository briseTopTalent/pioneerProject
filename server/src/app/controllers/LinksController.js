const service = require('../services/link');
const { jsonFailed, jsonS } = require('../../utils');

const Controller = {
  findAll: async (req, res) => {
    const { location, page, limit } = req.query;
    const response = await service.FindAll(location, page, limit);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  FindOne: async (req, res) => {
    const response = await service.FindOne(req.params.id);
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
    const response = await service.Create(req.body);
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
    const response = await service.Update(req.params.id, req.body);
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
    const response = await service.Delete(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};

module.exports = Controller;
