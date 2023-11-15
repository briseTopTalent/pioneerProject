const CommentService = require('../services/comment');
const { jsonFailed, jsonS } = require('../../utils');

const CommentController = {
  fetchAll: async (req, res) => {
    const { locality, page, limit } = req.query;
    const response = await CommentService.FetchComment(
      locality,
      page,
      limit,
      req.user.role
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  FetchByID: async (req, res) => {
    const response = await CommentService.FindByID(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  FetchIncidentComments: async (req, res) => {
    const response = await CommentService.FetchIncidentComments(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  CreateComment: async (req, res) => {
    const response = await CommentService.CreateComment(req.user.id, req.body);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  updateComment: async (req, res) => {
    const response = await CommentService.UpdateComment(
      req.params.id,
      req.body
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  deleteComment: async (req, res) => {
    //console.debug({delc: req});

    const existing = await CommentService.FindByID(req.params.id);
    console.debug({ existing });
    const author_id = existing.data.user_id;

    if (!req.user.role === 'super') {
      if (parseInt(req.user.id, 10) !== author_id) {
        return jsonFailed(
          res,
          {
            message: 'Only super users can delete comments made by others',
          },
          {},
          400,
          {}
        );
      }
    }

    const response = await CommentService.DeleteComment(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};

module.exports = CommentController;
