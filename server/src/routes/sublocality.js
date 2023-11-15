const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createSubLocalitySchema,
} = require('../app/requests/query');
const Controller = require('../app/controllers/subLocalityController');

router.get('/', celebrate(querySchema), controllerWrapper(Controller.findAll));
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(Controller.FindOne)
);
router.post(
  '/',
  celebrate(createSubLocalitySchema),
  controllerWrapper(Controller.Create)
);
router.patch(
  '/:id',
  celebrate(createSubLocalitySchema),
  controllerWrapper(Controller.Update)
);
router.delete(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(Controller.Delete)
);

module.exports = {
  baseUrl: '/sub-locality',
  router,
  auth: true,
};
