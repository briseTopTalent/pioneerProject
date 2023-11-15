const CalendarService = require('../services/calendar');
const { jsonFailed, jsonS } = require('../../utils');

const CalendarController = {
  fetchAll: async (req, res) => {
    const { locality, page, limit } = req.query;
    const response = await CalendarService.FindAll(locality, page, limit);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  fetchByID: async (req, res) => {
    const response = await CalendarService.FindOne(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  create: async (req, res) => {
    const response = await CalendarService.Create(req.user.id, req.body);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  update: async (req, res) => {
    const response = await CalendarService.Update(req.params.id, req.body);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  delete: async (req, res) => {
    const response = await CalendarService.Delete(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};

module.exports = CalendarController;
