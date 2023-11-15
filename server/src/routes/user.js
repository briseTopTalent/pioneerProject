const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const { querySchema, querySchemaSingle } = require('../app/requests/query');
const {
  createAdminSchema,
  updateAdminSchema,
  subscribeToLocality,
  updateUserSchema,
  unsubscribeToLocality,
  fbLoginSchema,
} = require('../app/requests/auth');
const UserController = require('../app/controllers/userController');

router.get('/profile', controllerWrapper(UserController.fetchUsersProfile));
router.post(
  '/locality/subscribe',
  celebrate(subscribeToLocality),
  controllerWrapper(UserController.subscribeToLocality)
);
router.delete(
  '/locality/subscribe',
  celebrate(unsubscribeToLocality),
  controllerWrapper(UserController.unsubscribeFromLocality)
);
router.get(
  '/',
  celebrate(querySchema),
  controllerWrapper(UserController.fetchAllUsers)
);
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(UserController.FetchSingleUser)
);
router.post(
  '/',
  celebrate(createAdminSchema),
  controllerWrapper(UserController.CreateUser)
);
router.patch(
  '/:id',
  celebrate(updateAdminSchema),
  controllerWrapper(UserController.EditUser)
);
router.patch(
  '/',
  celebrate(updateUserSchema),
  controllerWrapper(UserController.UpdateUser)
);
router.post(
  '/fb',
  celebrate(fbLoginSchema),
  controllerWrapper(UserController.saveFacebookTokens)
);

module.exports = {
  baseUrl: '/users',
  router,
  auth: true,
};
