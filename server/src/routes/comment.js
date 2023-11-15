const router = require('express').Router();
const { celebrate } = require('celebrate');
const controllerWrapper = require('../app/controllers');
const {
  querySchema,
  querySchemaSingle,
  createComment,
} = require('../app/requests/query');
const CommentController = require('../app/controllers/commentController');

//router.get("/", celebrate(querySchema), controllerWrapper(CommentController.fetchAll));
router.get('/:id', controllerWrapper(CommentController.FetchIncidentComments));
router.post(
  '/',
  celebrate(createComment),
  controllerWrapper(CommentController.CreateComment)
);
router.patch(
  '/:id',
  celebrate(createComment),
  controllerWrapper(CommentController.updateComment)
);
router.delete(
  '/:id',
  celebrate(querySchemaSingle),
  controllerWrapper(CommentController.deleteComment)
);

module.exports = {
  baseUrl: '/comments',
  router,
  auth: true,
};
