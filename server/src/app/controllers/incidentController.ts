const IncidentService = require('../services/incident');
const { getRedisDataGroupBy , refreshIncidentLikes, } = require('../../database/redis');
import { jsonFailed, jsonS } from '../../utils';
import { Request, Response, NextFunction } from 'express';
import {
  createIncident,
} from '../services/incident/create';
const models = require('../models/');
const sequelize = models.Sequelize;

export const IncidentController = {
  GetByLocality: async (req: Request, res: Response) => {
    const response = await IncidentService.GetByLocality(req.query);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  GetDetailsById: async (req: Request, res: Response) => {
    const response = await IncidentService.GetDetailsById(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  CommentOnIncident: async (req: Request, res: Response) => {
    if (!req.user) {
      return jsonFailed(
        res,
        null,
        'Must be logged in to perform this task.',
        400,
        {}
      );
    }
    const response = await IncidentService.CommentOnIncident(
      req.user.id,
      req.body
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  FetchCount: async (req: Request, res: Response) => {
    const response = await IncidentService.FetchCount();
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  fetchAll: async (req: Request, res: Response) => {
    if (!req.user) {
      return jsonFailed(
        res,
        null,
        'Must be logged in to perform this task.',
        400,
        {}
      );
    }
    const { locality, page, limit } = req.query;
    const response = await IncidentService.FetchIncident(
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

  FetchByID: async (req: Request, res: Response) => {
    const response = await IncidentService.FindByID(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },

  CreateIncident: async (req: Request, res: Response) => {
    if (!req.user) {
      return jsonFailed(
        res,
        null,
        'Must be logged in to perform this task.',
        400,
        {}
      );
    }
    if(!['admin','super'].includes(req.user.role)){
      return jsonFailed(res, null, 'You do not have the correct permissions.', 400, {});
    }
    let incident: ION.Incident = {
      locality: req.body.locality,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      created_by: req.user.id,
      featured: req.body.featured,
      address: req.body.address,
      sub_locality: null,
    };
    if(String(req.body.longitude) === '0' || String(req.body.longitude).length === 0){
      return jsonFailed(res, null, 'Longitude is required. It cannot be zero or empty', 400, {});
    }
    if(String(req.body.latitude) === '0' || String(req.body.latitude).length === 0){
      return jsonFailed(res, null, 'Latitude is required. It cannot be zero or empty', 400, {});
    }
    if(typeof req.body.sub_locality !== 'undefined' && req.body.sub_locality !== null && String(req.body.sub_locality).length > 0){
      incident.sub_locality = req.body.sub_locality
    }else{
      delete incident.sub_locality
    }
    if (
      typeof req.body.field1_value !== 'undefined' &&
      req.body.field1_value !== null &&
      String(req.body.field1_value).length
    ) {
      incident.field1_value = req.body.field1_value;
    }
    if (
      typeof req.body.field2_value !== 'undefined' &&
      req.body.field2_value !== null &&
      String(req.body.field2_value).length
    ) {
      incident.field2_value = req.body.field2_value;
    }
    if (
      typeof req.body.field3_value !== 'undefined' &&
      req.body.field3_value !== null &&
      String(req.body.field3_value).length
    ) {
      incident.field3_value = req.body.field3_value;
    }
    if (
      typeof req.body.field4_value !== 'undefined' &&
      req.body.field4_value !== null &&
      String(req.body.field4_value).length
    ) {
      incident.field4_value = req.body.field4_value;
    }
    if (
      typeof req.body.field5_value !== 'undefined' &&
      req.body.field5_value !== null &&
      String(req.body.field5_value).length
    ) {
      incident.field5_value = req.body.field5_value;
    }
    if (typeof req.body.responding_units !== 'undefined' && Array.isArray(req.body.responding_units) && req.body.responding_units.length) {
      incident.responding_units = req.body.responding_units;
    }
    let sendPush: boolean = false;
    if (typeof req.body.send_push_notification !== 'undefined') {
      sendPush = req.body.send_push_notification;
    }
    let fbPages : Array<string> = [];
    if(typeof req.body.facebook_pages !== 'undefined' && Array.isArray(req.body.facebook_pages) && req.body.facebook_pages.length > 0){
      for(const pageId of req.body.facebook_pages){
        if(fbPages.indexOf(pageId) > -1){
          continue;
        }
        fbPages.push(pageId);
      }
    }
    let twitterPages : Array<string> = [];
    if(typeof req.body.twitter !== 'undefined' && Array.isArray(req.body.twitter) && req.body.twitter.length > 0){
      for(const pageId of req.body.twitter){
        if(twitterPages.indexOf(pageId) > -1){
          continue;
        }
        twitterPages.push(pageId);
      }
    }
    const response = await createIncident(req.user.id, incident, sendPush, fbPages, twitterPages);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  getMultiLikes: async (req: Request, res: Response) => {
    /**
     * Same endpoint as getLikes, except it accepts "incidentID" as
     * an array of integers
     */
    let likes = await getRedisDataGroupBy(['incident','likes',req.body.ids], ['incident-likes','incident-delete','incident-update'], async () => {
      return await models.LikedIncidents.findAll({
        attributes:['incident_id',[sequelize.fn('COUNT',sequelize.col('_user')),'userCount']],
        where: {
          incident_id: {
            [sequelize.Op.in]: req.body.ids,
          },
        },
        group: ['incident_id'],
        raw: true,
      });
    });
    let m: { [index: number]: number } = {}
    for(const id of req.body.ids){
      m[id] = 0
    }
    for(const row of likes){
      m[row.incident_id] = parseInt(row.userCount,10);
    }
    return jsonS(res, m, 'Ok', 200, {});
  },
  getLikes: async (req: Request, res: Response) => {
    let likes = await getRedisDataGroupBy(['incident',req.params.id,'likes'], ['incident-update','incident-likes'], async () => {
      return await models.LikedIncidents.findAll({
        attributes:['_user'],
        where: {
          incident_id: req.params.id,
        },
      });
    });
    let idList: Array<number> = []
    for(const row of likes){
      idList.push(row._user);
    }
    return jsonS(res, idList, 'Ok', 200, {});
  },
  dislikeIncident: async (req: Request, res: Response) => {
    if(!req.user){
      return jsonFailed(res, null, 'You must be logged in.', 400, {});
    }

    const response = await IncidentService.DislikeIncident(
      req.user.id,
      req.body.incidentID
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    await refreshIncidentLikes(req.body.incidentID);
    return jsonS(res, response.data, response.message, 200, {});
  },
  likeIncident: async (req: Request, res: Response) => {
    if(!req.user){
      return jsonFailed(res, null, 'You must be logged in.', 400, {});
    }

    const response = await IncidentService.LikeIncident(
      req.user.id,
      req.body.incidentID
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    await refreshIncidentLikes(req.body.incidentID);
    return jsonS(res, response.data, response.message, 200, {});
  },
  updateIncident: async (req: Request, res: Response) => {
    if(typeof req.user !== 'undefined' && !['admin','super'].includes(req.user.role)){
      return jsonFailed(res, null, 'You do not have the correct permissions.', 400, {});
    }
    if(String(req.body.longitude) === '0' || String(req.body.longitude).length === 0){
      return jsonFailed(res, null, 'Longitude is required. It cannot be zero or empty', 400, {});
    }
    if(String(req.body.latitude) === '0' || String(req.body.latitude).length === 0){
      return jsonFailed(res, null, 'Latitude is required. It cannot be zero or empty', 400, {});
    }
    let fbPages : Array<string> = [];
    if(typeof req.body.facebook_pages !== 'undefined' && Array.isArray(req.body.facebook_pages) && req.body.facebook_pages.length > 0){
      for(const pageId of req.body.facebook_pages){
        if(fbPages.indexOf(pageId) > -1){
          continue;
        }
        fbPages.push(pageId);
      }
    }
    let twitterPages : Array<string> = [];
    if(typeof req.body.twitter !== 'undefined' && Array.isArray(req.body.twitter) && req.body.twitter.length > 0){
      for(const pageId of req.body.twitter){
        if(twitterPages.indexOf(pageId) > -1){
          continue;
        }
        twitterPages.push(pageId);
      }
    }
    const response = await IncidentService.UpdateIncident(
      req.params.id,
      req.body,
      fbPages,
      twitterPages
    );
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
  deleteIncident: async (req: Request, res: Response) => {
    if(typeof req.user !== 'undefined' && !['admin','super'].includes(req.user.role)){
      return jsonFailed(res, null, 'You do not have the correct permissions.', 400, {});
    }
    const response = await IncidentService.DeleteIncident(req.params.id);
    if (response.error) {
      return jsonFailed(res, null, response.message, 400, {});
    }
    return jsonS(res, response.data, response.message, 200, {});
  },
};
