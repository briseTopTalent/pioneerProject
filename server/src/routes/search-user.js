const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const { querySchema, querySchemaSingle } = require('../app/requests/query');
const {
  createAdminSchema,
  updateAdminSchema,
} = require('../app/requests/auth');
const UserController = require('../app/controllers/userController');

router.post('/', controllerWrapper(UserController.SearchUser));

module.exports = {
  baseUrl: '/search-users',
  router,
  auth: true,
};
