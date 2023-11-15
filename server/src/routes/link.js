const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createScanner,
} = require('../app/requests/query');
const Controller = require('../app/controllers/LinksController');

router.get('/', celebrate(querySchema), controllerWrapper(Controller.findAll));
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(Controller.FindOne)
);
router.post(
  '/',
  celebrate(createScanner),
  controllerWrapper(Controller.Create)
);
router.patch(
  '/:id',
  celebrate(createScanner),
  controllerWrapper(Controller.Update)
);
router.delete(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(Controller.Delete)
);

module.exports = {
  baseUrl: '/links',
  router,
  auth: true,
};
