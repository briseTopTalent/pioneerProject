const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createEvent,
} = require('../app/requests/query');
const CalendarController = require('../app/controllers/calendarController');

router.get(
  '/',
  celebrate(querySchema),
  controllerWrapper(CalendarController.fetchAll)
);
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(CalendarController.fetchByID)
);
router.post(
  '/',
  celebrate(createEvent),
  controllerWrapper(CalendarController.create)
);
router.patch(
  '/:id',
  celebrate(createEvent),
  controllerWrapper(CalendarController.update)
);
router.delete(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(CalendarController.delete)
);

module.exports = {
  baseUrl: '/events',
  router,
  auth: true,
};
