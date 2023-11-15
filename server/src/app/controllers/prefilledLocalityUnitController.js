const Service = require('../services/prefilledLocalityUnits');
const { jsonFailed, jsonS } = require('../../utils');

const prefilledLocalityUnitController = {
  findAll: async (req, res) => {
    const { locality, page, limit } = req.query;
    const response = await Service.FindAll(locality, page, limit);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};

module.exports = prefilledLocalityUnitController;
