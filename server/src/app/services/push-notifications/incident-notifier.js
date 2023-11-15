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
exports.IncidentNotifier = void 0;
var models = require('../../models');
var sequelize = models.Sequelize;
var IncidentNotifier = /** @class */ (function () {
    function IncidentNotifier() {
        this.model = models.Incident;
        this.incident = null;
        this.notificationsModel = models.Notifications;
    }
    IncidentNotifier.prototype.queueLocalityChunk = function (incident, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var localityUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationsModel.findAll({
                            attributes: ['_user'],
                            col: '_user',
                            distinct: true,
                            where: {
                                notification_type: 'locality',
                                notification_id: String(incident.locality),
                            },
                            limit: pageSize,
                            offset: page * pageSize,
                        })];
                    case 1:
                        localityUsers = _a.sent();
                        return [2 /*return*/, localityUsers];
                }
            });
        });
    };
    IncidentNotifier.prototype.queueSubLocalityChunk = function (incident, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationsModel.findAll({
                            attributes: ['_user'],
                            col: '_user',
                            distinct: true,
                            where: {
                                notification_type: 'sub_locality',
                                notification_id: String(incident.sub_locality),
                            },
                            limit: pageSize,
                            offset: page * pageSize,
                        })];
                    case 1: 
                    /**
                     * Fetch anyone with matching sub locality
                     */
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IncidentNotifier.prototype.queueIncidentTypeChunk = function (incident, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationsModel.findAll({
                            attributes: ['_user'],
                            col: '_user',
                            distinct: true,
                            where: {
                                notification_type: 'incident_type',
                                notification_id: incident.field1_value,
                            },
                            limit: pageSize,
                            offset: page * pageSize,
                        })];
                    case 1: 
                    /**
                     * Fetch anyone with matching incident type
                     */
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IncidentNotifier.prototype.queueUnitChunk = function (incident, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof incident.responding_units === 'undefined' ||
                            incident.responding_units === null ||
                            incident.responding_units.length === 0) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.notificationsModel.findAll({
                                attributes: ['_user'],
                                col: '_user',
                                distinct: true,
                                where: {
                                    notification_type: 'unit',
                                    notification_id: (_a = {},
                                        _a[sequelize.Op.in] = incident.responding_units,
                                        _a),
                                },
                                limit: pageSize,
                                offset: page * pageSize,
                            })];
                    case 1: 
                    /**
                     * Fetch anyone with matching respoonding units
                     */
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    IncidentNotifier.prototype.createRows = function (incident, notifications) {
        return __awaiter(this, void 0, void 0, function () {
            var count, _i, notifications_1, row, pushRecord, insertedRow, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof incident.id === 'undefined' || incident.id === null) {
                            console.error("createRows expects incident.id to be set!");
                            return [2 /*return*/, 0];
                        }
                        count = 0;
                        _i = 0, notifications_1 = notifications;
                        _a.label = 1;
                    case 1:
                        if (!(_i < notifications_1.length)) return [3 /*break*/, 6];
                        row = notifications_1[_i];
                        pushRecord = {
                            _user: row._user,
                            incident_id: incident.id,
                            claimed_by: null,
                        };
                        delete pushRecord.id;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, models.PushNotifications.create(pushRecord)];
                    case 3:
                        insertedRow = _a.sent();
                        ++count;
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        if ('message' in e_1) {
                            console.error("PushNotifications.create failed with: \"".concat(e_1.message, "\""));
                        }
                        if (typeof e_1 === 'string') {
                            console.error("PushNotifications.create failed with: \"".concat(e_1, "\""));
                        }
                        console.error("PushNotifications.create failed: ", e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, count];
                }
            });
        });
    };
    IncidentNotifier.prototype.createRowsInPushNotificationsTable = function (incident) {
        return __awaiter(this, void 0, void 0, function () {
            var count, page, notifications, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log('here top');
                        count = 0;
                        page = 0;
                        notifications = [];
                        _e.label = 1;
                    case 1: return [4 /*yield*/, this.queueLocalityChunk(incident, page++, 250)];
                    case 2:
                        notifications = _e.sent();
                        _a = count;
                        return [4 /*yield*/, this.createRows(incident, notifications)];
                    case 3:
                        count = _a + _e.sent();
                        console.debug('.');
                        _e.label = 4;
                    case 4:
                        if (notifications && notifications.length) return [3 /*break*/, 1];
                        _e.label = 5;
                    case 5:
                        page = 0;
                        _e.label = 6;
                    case 6: return [4 /*yield*/, this.queueSubLocalityChunk(incident, page++, 250)];
                    case 7:
                        notifications = _e.sent();
                        _b = count;
                        return [4 /*yield*/, this.createRows(incident, notifications)];
                    case 8:
                        count = _b + _e.sent();
                        console.debug('@');
                        _e.label = 9;
                    case 9:
                        if (notifications && notifications.length) return [3 /*break*/, 6];
                        _e.label = 10;
                    case 10:
                        page = 0;
                        _e.label = 11;
                    case 11: return [4 /*yield*/, this.queueIncidentTypeChunk(incident, page++, 250)];
                    case 12:
                        notifications = _e.sent();
                        _c = count;
                        return [4 /*yield*/, this.createRows(incident, notifications)];
                    case 13:
                        count = _c + _e.sent();
                        _e.label = 14;
                    case 14:
                        if (notifications && notifications.length) return [3 /*break*/, 11];
                        _e.label = 15;
                    case 15:
                        page = 0;
                        _e.label = 16;
                    case 16: return [4 /*yield*/, this.queueUnitChunk(incident, page++, 250)];
                    case 17:
                        notifications = _e.sent();
                        _d = count;
                        return [4 /*yield*/, this.createRows(incident, notifications)];
                    case 18:
                        count = _d + _e.sent();
                        _e.label = 19;
                    case 19:
                        if (notifications && notifications.length) return [3 /*break*/, 16];
                        _e.label = 20;
                    case 20: return [2 /*return*/, count];
                }
            });
        });
    };
    return IncidentNotifier;
}());
exports.IncidentNotifier = IncidentNotifier;
//# sourceMappingURL=incident-notifier.js.map