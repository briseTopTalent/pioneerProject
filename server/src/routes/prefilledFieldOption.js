const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const { querySchema } = require('../app/requests/query');
const Controller = require('../app/controllers/prefilledFieldOptionController');

router.get('/', celebrate(querySchema), controllerWrapper(Controller.findAll));

module.exports = {
  baseUrl: '/prefilled-field-option',
  router,
  auth: true,
};
