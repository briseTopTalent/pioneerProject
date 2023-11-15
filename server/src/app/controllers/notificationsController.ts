const NotificationsService = require('../services/notifications');
import { jsonFailed, jsonS, dd, xt, } from '../../utils'
import { Request, Response, NextFunction } from 'express';

export default  {
  FetchAll: async (req: Request, res: Response) => {
    if(!req.user){
      return jsonFailed(res, null, 'You must be logged in to perform this action', 400, {});
    }
    const response = await NotificationsService.FetchAll(req.user);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  CreateNotification: async (req: Request, res: Response) => {
    if(!req.user){
      return jsonFailed(res, null, 'You must be logged in to perform this action', 400, {});
    }
    const response = await NotificationsService.CreateNotification(
      req.user,
      req.body.notification_type,
      req.body.notification_id
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  UpdateNotification: async (req: Request, res: Response) => {
    if(!req.user){
      return jsonFailed(res, null, 'You must be logged in to perform this action', 400, {});
    }
    const response = await NotificationsService.UpdateNotification(
      req.user,
      req.params.id,
      req.body
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  RemoveNotification: async (req: Request, res: Response) => {
    if(!req.user){
      return jsonFailed(res, null, 'You must be logged in to perform this action', 400, {});
    }
    const response = await NotificationsService.RemoveNotification(
      req.user,
      req.params.id
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};
