const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const { querySchema, querySchemaSingle } = require('../app/requests/query');
const {
  createAdminSchema,
  updateAdminSchema,
} = require('../app/requests/auth');
const UserController = require('../app/controllers/userController');
const LocalityController = require('../app/controllers/localityController');
const { IncidentController } = require('../app/controllers/incidentController');

router.get('/users', controllerWrapper(UserController.FetchCount));
router.get('/localities', controllerWrapper(LocalityController.FetchCount));
router.get('/incidents', controllerWrapper(IncidentController.FetchCount));

module.exports = {
  baseUrl: '/count',
  router,
  auth: true,
};
