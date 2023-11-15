const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createPOI,
} = require('../app/requests/query');
const POIController = require('../app/controllers/poiController');

router.get(
  '/',
  celebrate(querySchema),
  controllerWrapper(POIController.findAll)
);
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(POIController.FindOne)
);
router.post('/', celebrate(createPOI), controllerWrapper(POIController.Create));
router.patch(
  '/:id',
  celebrate(createPOI),
  controllerWrapper(POIController.Update)
);
router.delete(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(POIController.Delete)
);

module.exports = {
  baseUrl: '/point-of-interest',
  router,
  auth: true,
};
