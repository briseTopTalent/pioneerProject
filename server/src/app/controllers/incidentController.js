"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentController = void 0;
var IncidentService = require('../services/incident');
var _a = require('../../database/redis'), getRedisDataGroupBy = _a.getRedisDataGroupBy, refreshIncidentLikes = _a.refreshIncidentLikes;
var utils_1 = require("../../utils");
var create_1 = require("../services/incident/create");
var models = require('../models/');
var sequelize = models.Sequelize;
exports.IncidentController = {
    GetByLocality: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, IncidentService.GetByLocality(req.query)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    GetDetailsById: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, IncidentService.GetDetailsById(req.params.id)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    CommentOnIncident: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.user) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'Must be logged in to perform this task.', 400, {})];
                    }
                    return [4 /*yield*/, IncidentService.CommentOnIncident(req.user.id, req.body)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    FetchCount: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, IncidentService.FetchCount()];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    fetchAll: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, locality, page, limit, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.user) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'Must be logged in to perform this task.', 400, {})];
                    }
                    _a = req.query, locality = _a.locality, page = _a.page, limit = _a.limit;
                    return [4 /*yield*/, IncidentService.FetchIncident(locality, page, limit, req.user.role)];
                case 1:
                    response = _b.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    FetchByID: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, IncidentService.FindByID(req.params.id)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    CreateIncident: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var incident, sendPush, fbPages, _i, _a, pageId, twitterPages, _b, _c, pageId, response;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!req.user) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'Must be logged in to perform this task.', 400, {})];
                    }
                    if (!['admin', 'super'].includes(req.user.role)) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'You do not have the correct permissions.', 400, {})];
                    }
                    incident = {
                        locality: req.body.locality,
                        longitude: req.body.longitude,
                        latitude: req.body.latitude,
                        created_by: req.user.id,
                        featured: req.body.featured,
                        address: req.body.address,
                        sub_locality: null,
                    };
                    if (String(req.body.longitude) === '0' || String(req.body.longitude).length === 0) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'Longitude is required. It cannot be zero or empty', 400, {})];
                    }
                    if (String(req.body.latitude) === '0' || String(req.body.latitude).length === 0) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'Latitude is required. It cannot be zero or empty', 400, {})];
                    }
                    if (typeof req.body.sub_locality !== 'undefined' && req.body.sub_locality !== null && String(req.body.sub_locality).length > 0) {
                        incident.sub_locality = req.body.sub_locality;
                    }
                    else {
                        delete incident.sub_locality;
                    }
                    if (typeof req.body.field1_value !== 'undefined' &&
                        req.body.field1_value !== null &&
                        String(req.body.field1_value).length) {
                        incident.field1_value = req.body.field1_value;
                    }
                    if (typeof req.body.field2_value !== 'undefined' &&
                        req.body.field2_value !== null &&
                        String(req.body.field2_value).length) {
                        incident.field2_value = req.body.field2_value;
                    }
                    if (typeof req.body.field3_value !== 'undefined' &&
                        req.body.field3_value !== null &&
                        String(req.body.field3_value).length) {
                        incident.field3_value = req.body.field3_value;
                    }
                    if (typeof req.body.field4_value !== 'undefined' &&
                        req.body.field4_value !== null &&
                        String(req.body.field4_value).length) {
                        incident.field4_value = req.body.field4_value;
                    }
                    if (typeof req.body.field5_value !== 'undefined' &&
                        req.body.field5_value !== null &&
                        String(req.body.field5_value).length) {
                        incident.field5_value = req.body.field5_value;
                    }
                    if (typeof req.body.responding_units !== 'undefined' && Array.isArray(req.body.responding_units) && req.body.responding_units.length) {
                        incident.responding_units = req.body.responding_units;
                    }
                    sendPush = false;
                    if (typeof req.body.send_push_notification !== 'undefined') {
                        sendPush = req.body.send_push_notification;
                    }
                    fbPages = [];
                    if (typeof req.body.facebook_pages !== 'undefined' && Array.isArray(req.body.facebook_pages) && req.body.facebook_pages.length > 0) {
                        for (_i = 0, _a = req.body.facebook_pages; _i < _a.length; _i++) {
                            pageId = _a[_i];
                            if (fbPages.indexOf(pageId) > -1) {
                                continue;
                            }
                            fbPages.push(pageId);
                        }
                    }
                    twitterPages = [];
                    if (typeof req.body.twitter !== 'undefined' && Array.isArray(req.body.twitter) && req.body.twitter.length > 0) {
                        for (_b = 0, _c = req.body.twitter; _b < _c.length; _b++) {
                            pageId = _c[_b];
                            if (twitterPages.indexOf(pageId) > -1) {
                                continue;
                            }
                            twitterPages.push(pageId);
                        }
                    }
                    return [4 /*yield*/, (0, create_1.createIncident)(req.user.id, incident, sendPush, fbPages, twitterPages)];
                case 1:
                    response = _d.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    getMultiLikes: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var likes, m, _i, _a, id, _b, likes_1, row;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getRedisDataGroupBy(['incident', 'likes', req.body.ids], ['incident-likes', 'incident-delete', 'incident-update'], function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, models.LikedIncidents.findAll({
                                        attributes: ['incident_id', [sequelize.fn('COUNT', sequelize.col('_user')), 'userCount']],
                                        where: {
                                            incident_id: (_a = {},
                                                _a[sequelize.Op.in] = req.body.ids,
                                                _a),
                                        },
                                        group: ['incident_id'],
                                        raw: true,
                                    })];
                                case 1: return [2 /*return*/, _b.sent()];
                            }
                        });
                    }); })];
                case 1:
                    likes = _c.sent();
                    m = {};
                    for (_i = 0, _a = req.body.ids; _i < _a.length; _i++) {
                        id = _a[_i];
                        m[id] = 0;
                    }
                    for (_b = 0, likes_1 = likes; _b < likes_1.length; _b++) {
                        row = likes_1[_b];
                        m[row.incident_id] = parseInt(row.userCount, 10);
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, m, 'Ok', 200, {})];
            }
        });
    }); },
    getLikes: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var likes, idList, _i, likes_2, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRedisDataGroupBy(['incident', req.params.id, 'likes'], ['incident-update', 'incident-likes'], function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, models.LikedIncidents.findAll({
                                        attributes: ['_user'],
                                        where: {
                                            incident_id: req.params.id,
                                        },
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
                case 1:
                    likes = _a.sent();
                    idList = [];
                    for (_i = 0, likes_2 = likes; _i < likes_2.length; _i++) {
                        row = likes_2[_i];
                        idList.push(row._user);
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, idList, 'Ok', 200, {})];
            }
        });
    }); },
    dislikeIncident: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.user) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'You must be logged in.', 400, {})];
                    }
                    return [4 /*yield*/, IncidentService.DislikeIncident(req.user.id, req.body.incidentID)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [4 /*yield*/, refreshIncidentLikes(req.body.incidentID)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    likeIncident: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.user) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'You must be logged in.', 400, {})];
                    }
                    return [4 /*yield*/, IncidentService.LikeIncident(req.user.id, req.body.incidentID)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [4 /*yield*/, refreshIncidentLikes(req.body.incidentID)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    updateIncident: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var fbPages, _i, _a, pageId, twitterPages, _b, _c, pageId, response;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (typeof req.user !== 'undefined' && !['admin', 'super'].includes(req.user.role)) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'You do not have the correct permissions.', 400, {})];
                    }
                    if (String(req.body.longitude) === '0' || String(req.body.longitude).length === 0) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'Longitude is required. It cannot be zero or empty', 400, {})];
                    }
                    if (String(req.body.latitude) === '0' || String(req.body.latitude).length === 0) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'Latitude is required. It cannot be zero or empty', 400, {})];
                    }
                    fbPages = [];
                    if (typeof req.body.facebook_pages !== 'undefined' && Array.isArray(req.body.facebook_pages) && req.body.facebook_pages.length > 0) {
                        for (_i = 0, _a = req.body.facebook_pages; _i < _a.length; _i++) {
                            pageId = _a[_i];
                            if (fbPages.indexOf(pageId) > -1) {
                                continue;
                            }
                            fbPages.push(pageId);
                        }
                    }
                    twitterPages = [];
                    if (typeof req.body.twitter !== 'undefined' && Array.isArray(req.body.twitter) && req.body.twitter.length > 0) {
                        for (_b = 0, _c = req.body.twitter; _b < _c.length; _b++) {
                            pageId = _c[_b];
                            if (twitterPages.indexOf(pageId) > -1) {
                                continue;
                            }
                            twitterPages.push(pageId);
                        }
                    }
                    return [4 /*yield*/, IncidentService.UpdateIncident(req.params.id, req.body, fbPages, twitterPages)];
                case 1:
                    response = _d.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
    deleteIncident: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof req.user !== 'undefined' && !['admin', 'super'].includes(req.user.role)) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, 'You do not have the correct permissions.', 400, {})];
                    }
                    return [4 /*yield*/, IncidentService.DeleteIncident(req.params.id)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, (0, utils_1.jsonFailed)(res, null, response.message, 400, {})];
                    }
                    return [2 /*return*/, (0, utils_1.jsonS)(res, response.data, response.message, 200, {})];
            }
        });
    }); },
};
//# sourceMappingURL=incidentController.js.map