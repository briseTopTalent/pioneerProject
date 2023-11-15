const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createLocalitySchema,
  updateLocalitySchema,
  addSubAdminSchema,
  addDefinition,
  queryArrayIds,
} = require('../app/requests/query');
const LocalityController = require('../app/controllers/localityController');

router.get(
  '/',
  celebrate(querySchema),
  controllerWrapper(LocalityController.fetchAllLocalities)
);
router.get(
  '/setup',
  celebrate(queryArrayIds),
  controllerWrapper(LocalityController.getSetup)
);
router.get(
  '/recursive',
  celebrate(querySchema),
  controllerWrapper(LocalityController.recursiveFetchAllLocalities)
);

router.get(
  '/available',
  celebrate(querySchema),
  controllerWrapper(LocalityController.fetchAvailableLocalities)
);
router.get(
  '/for-user/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(LocalityController.FetchLocalityForUser)
);
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(LocalityController.FetchLocality)
);
router.get(
  '/:id/admins',
  celebrate(querySchemaSingle),
  controllerWrapper(LocalityController.viewLocalityAdmins)
);
router.get(
  '/:id/push-setup',
  celebrate(querySchemaSingle),
  controllerWrapper(LocalityController.FetchLocalityPushSetup)
);
router.post(
  '/',
  celebrate(createLocalitySchema),
  controllerWrapper(LocalityController.CreateLocality)
);
router.patch(
  '/:id',
  celebrate(updateLocalitySchema),
  controllerWrapper(LocalityController.UpdateLocality)
);
router.post(
  '/:id/admins',
  celebrate(addSubAdminSchema),
  controllerWrapper(LocalityController.AddAdminToLocality)
);
router.delete(
  '/:id/admins/:email',
  controllerWrapper(LocalityController.RemoveAdminToLocality)
);
router.get(
  '/:id/for-admins',
  celebrate(querySchemaSingle),
  controllerWrapper(LocalityController.ViewAdminLocality)
);
router.get(
  '/:id/incident-definitions',
  celebrate(querySchemaSingle),
  controllerWrapper(LocalityController.FetchDefinition)
);
router.post(
  '/:id/incident-definitions',
  celebrate(addDefinition),
  controllerWrapper(LocalityController.AddDefinition)
);
router.get(
  '/:id/responding-units',
  celebrate(querySchemaSingle),
  controllerWrapper(LocalityController.FetchRespondingUnits)
);

module.exports = {
  baseUrl: '/localities',
  router,
  auth: true,
};
