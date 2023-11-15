const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  //querySchemaSingle,
  createNotificationSchema,
  updateNotificationSchema,
  //addSubAdminSchema,
  //addDefinition,
  //queryArrayIds,
} = require('../app/requests/query');
const NotificationsController = require('../app/controllers/notificationsController');

router.get(
  '/',
  celebrate(querySchema),
  controllerWrapper(NotificationsController.FetchAll)
);
router.post(
  '/',
  celebrate(createNotificationSchema),
  controllerWrapper(NotificationsController.CreateNotification)
);
router.patch(
  '/:id',
  celebrate(updateNotificationSchema),
  controllerWrapper(NotificationsController.UpdateNotification)
);
router.delete(
  '/:id',
  controllerWrapper(NotificationsController.RemoveNotification)
);
/*
router.post(
  '/:id/admins',
  celebrate(addSubAdminSchema),
  controllerWrapper(NotificationsController.AddAdminToNotifications)
);
router.get(
  '/:id/for-admins',
  celebrate(querySchemaSingle),
  controllerWrapper(NotificationsController.ViewAdminNotifications)
);
router.get(
  '/:id/incident-definitions',
  celebrate(querySchemaSingle),
  controllerWrapper(NotificationsController.FetchDefinition)
);
router.post(
  '/:id/incident-definitions',
  celebrate(addDefinition),
  controllerWrapper(NotificationsController.AddDefinition)
);
*/

module.exports = {
  baseUrl: '/notifications',
  router,
  auth: true,
};
