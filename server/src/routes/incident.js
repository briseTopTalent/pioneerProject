const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createIncident,
  commentOnIncident,
  likeIncident,
  queryArrayIds,
} = require('../app/requests/query');
const { IncidentController } = require('../app/controllers/incidentController');
router.get(
  '/details/:id',
  controllerWrapper(IncidentController.GetDetailsById)
);
router.get('/locality', controllerWrapper(IncidentController.GetByLocality));

router.post(
  '/likes',
  celebrate(likeIncident),
  controllerWrapper(IncidentController.likeIncident)
);
router.post(
  '/dislikes',
  celebrate(likeIncident),
  controllerWrapper(IncidentController.dislikeIncident)
);
router.get(
  '/likes/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(IncidentController.getLikes)
);
router.post(
  '/likes/bulk',
  celebrate(queryArrayIds),
  controllerWrapper(IncidentController.getMultiLikes)
);
router.get(
  '/',
  celebrate(querySchema),
  controllerWrapper(IncidentController.fetchAll)
);
router.get(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(IncidentController.FetchByID)
);
router.post(
  '/comment',
  celebrate(commentOnIncident),
  controllerWrapper(IncidentController.CommentOnIncident)
);
router.post(
  '/',
  celebrate(createIncident),
  controllerWrapper(IncidentController.CreateIncident)
);
router.patch(
  '/:id',
  celebrate(createIncident),
  controllerWrapper(IncidentController.updateIncident)
);
router.delete(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(IncidentController.deleteIncident)
);

module.exports = {
  baseUrl: '/incidents',
  router,
  auth: true,
};
