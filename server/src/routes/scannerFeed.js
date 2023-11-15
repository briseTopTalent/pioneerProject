const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createScanner,
} = require('../app/requests/query');
const SFController = require('../app/controllers/scannerController');

router.get(
  '/',
  celebrate(querySchema),
  controllerWrapper(SFController.findAll)
);
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(SFController.FindOne)
);
router.post(
  '/',
  celebrate(createScanner),
  controllerWrapper(SFController.Create)
);
router.patch(
  '/:id',
  celebrate(createScanner),
  controllerWrapper(SFController.Update)
);
router.delete(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(SFController.Delete)
);

module.exports = {
  baseUrl: '/scanner-feeds',
  router,
  auth: true,
};
