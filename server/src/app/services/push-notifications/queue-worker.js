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
exports.QueueWorker = void 0;
var models = require('../../models');
var sequelize = models.Sequelize;
var crypto = require('crypto');
var one_signal_1 = require("./one-signal");
var QueueWorker = /** @class */ (function () {
    function QueueWorker() {
        this.model = models.PushNotifications;
        this.instanceId = crypto.randomUUID();
    }
    QueueWorker.prototype.getInstanceId = function () {
        return this.instanceId;
    };
    QueueWorker.prototype.grabRecords = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, idList, _i, rows_1, record, e_1, msg;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, models.PushNotifications.findAll({
                                attributes: ['id', 'incident_id', '_user',],
                                where: {
                                    claimed_by: (_a = {},
                                        _a[sequelize.Op.eq] = null,
                                        _a),
                                },
                                limit: count,
                            })];
                    case 1:
                        rows = _c.sent();
                        idList = [];
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            record = rows_1[_i];
                            if (typeof record.id === 'undefined') {
                                continue;
                            }
                            idList.push(record.id);
                        }
                        return [4 /*yield*/, models.PushNotifications.update({
                                claimed_by: this.instanceId,
                            }, {
                                where: {
                                    id: (_b = {},
                                        _b[sequelize.Op.in] = idList,
                                        _b),
                                },
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, {
                                records: rows,
                                error: false,
                                message: 'ok',
                                count: rows !== null ? rows.length : 0,
                            }];
                    case 3:
                        e_1 = _c.sent();
                        msg = 'error';
                        if (e_1 instanceof Error) {
                            msg = e_1.message;
                        }
                        if (typeof e_1 === 'string') {
                            msg = e_1;
                        }
                        return [2 /*return*/, {
                                records: [],
                                error: true,
                                message: msg,
                                count: 0,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueueWorker.prototype.getNycLocalityId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models.Locality.findAll({
                            where: {
                                name: 'New York City',
                            },
                        })];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows[0].id];
                }
            });
        });
    };
    QueueWorker.prototype.getLocalityStrings = function (incident) {
        return __awaiter(this, void 0, void 0, function () {
            var arr, loc, sub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = ['', ''];
                        return [4 /*yield*/, models.Locality.findOne({
                                where: {
                                    id: incident.locality,
                                },
                            })];
                    case 1:
                        loc = _a.sent();
                        arr = [loc.name, ''];
                        if (!(typeof incident.sub_locality !== 'undefined' && incident.sub_locality !== null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, models.SubLocality.findOne({
                                where: {
                                    id: incident.sub_locality,
                                },
                            })];
                    case 2:
                        sub = _a.sent();
                        arr = [loc.name, sub.name];
                        _a.label = 3;
                    case 3: return [2 /*return*/, arr];
                }
            });
        });
    };
    QueueWorker.prototype.generateIncidentMessage = function (incident) {
        return __awaiter(this, void 0, void 0, function () {
            var str, locStrings, nycLocalityID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        str = '';
                        return [4 /*yield*/, this.getLocalityStrings(incident)];
                    case 1:
                        locStrings = _a.sent();
                        if (locStrings[1].length) {
                            str = locStrings[1] + ' *';
                        }
                        else {
                            str = '*';
                        }
                        str += String(incident.field1_value).toUpperCase() + '*' + "\n";
                        return [4 /*yield*/, this.getNycLocalityId()];
                    case 2:
                        nycLocalityID = _a.sent();
                        if (String(incident.field3_value) !== 'null') {
                            if (nycLocalityID === incident.locality) {
                                str += 'Box ' + incident.field3_value + ' - ';
                            }
                            else {
                                str += incident.field3_value + ' - ';
                            }
                        }
                        str += incident.address + "\n";
                        if (String(incident.field2_value) !== 'null') {
                            str += String(incident.field2_value).toUpperCase();
                        }
                        return [2 /*return*/, str];
                }
            });
        });
    };
    QueueWorker.prototype.work = function (rowCount) {
        return __awaiter(this, void 0, void 0, function () {
            var batchGroup, status, acquiredRows, batch, incidentIdList, _i, _a, row, _b, _c, row, _d, _e, _f, _g, key, incident, _h, _j, oneSignalSDK, sent, _k, batchGroup_1, batch_1, resp, _l, _m, row;
            var _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        batchGroup = [];
                        status = {
                            error: false,
                            message: '',
                            status: 'started',
                            batchGroup: batchGroup,
                            sent: 0,
                        };
                        return [4 /*yield*/, this.grabRecords(rowCount)];
                    case 1:
                        acquiredRows = _q.sent();
                        if (acquiredRows.error) {
                            return [2 /*return*/, {
                                    error: true,
                                    message: "couldn't aqcuire rows: \"".concat(acquiredRows.message, "\""),
                                    status: 'acquire-rows-failure',
                                    batchGroup: batchGroup,
                                    sent: 0,
                                }];
                        }
                        status.error = false;
                        status.message = 'started';
                        batch = {};
                        incidentIdList = [];
                        for (_i = 0, _a = acquiredRows.records; _i < _a.length; _i++) {
                            row = _a[_i];
                            if (incidentIdList.indexOf(row.incident_id) === -1) {
                                incidentIdList.push(row.incident_id);
                            }
                            if (typeof batch[row.incident_id] === 'undefined') {
                                batch[row.incident_id] = [];
                            }
                        }
                        for (_b = 0, _c = acquiredRows.records; _b < _c.length; _b++) {
                            row = _c[_b];
                            batch[row.incident_id].push(row._user);
                        }
                        _d = batch;
                        _e = [];
                        for (_f in _d)
                            _e.push(_f);
                        _g = 0;
                        _q.label = 2;
                    case 2:
                        if (!(_g < _e.length)) return [3 /*break*/, 6];
                        _f = _e[_g];
                        if (!(_f in _d)) return [3 /*break*/, 5];
                        key = _f;
                        return [4 /*yield*/, models.Incident.findOne({
                                where: {
                                    id: key,
                                },
                            })];
                    case 3:
                        incident = _q.sent();
                        _j = (_h = batchGroup).push;
                        _o = {};
                        return [4 /*yield*/, this.generateIncidentMessage(incident)];
                    case 4:
                        _j.apply(_h, [(_o.message = _q.sent(),
                                _o.userIdList = batch[key],
                                _o)]);
                        _q.label = 5;
                    case 5:
                        _g++;
                        return [3 /*break*/, 2];
                    case 6:
                        oneSignalSDK = new one_signal_1.OneSignal();
                        sent = 0;
                        _k = 0, batchGroup_1 = batchGroup;
                        _q.label = 7;
                    case 7:
                        if (!(_k < batchGroup_1.length)) return [3 /*break*/, 10];
                        batch_1 = batchGroup_1[_k];
                        return [4 /*yield*/, oneSignalSDK.send(batch_1.userIdList, batch_1.message).catch(function (error) {
                                return error;
                            })];
                    case 8:
                        resp = _q.sent();
                        if (resp.error) {
                            console.error("oneSignalSDK.send() failed with: \"".concat(JSON.stringify(resp, null, 2), "\""));
                        }
                        else {
                            console.debug("oneSignalSDK.send() ok: \"".concat(JSON.stringify(resp, null, 2), "\""));
                            ++sent;
                        }
                        _q.label = 9;
                    case 9:
                        _k++;
                        return [3 /*break*/, 7];
                    case 10:
                        _l = 0, _m = acquiredRows.records;
                        _q.label = 11;
                    case 11:
                        if (!(_l < _m.length)) return [3 /*break*/, 14];
                        row = _m[_l];
                        return [4 /*yield*/, models.PushNotifications.update({
                                sent_at: new Date(),
                            }, {
                                where: {
                                    id: row.id,
                                },
                            })];
                    case 12:
                        _q.sent();
                        _q.label = 13;
                    case 13:
                        _l++;
                        return [3 /*break*/, 11];
                    case 14: return [4 /*yield*/, models.PushNotifications.destroy({
                            where: {
                                sent_at: (_p = {},
                                    _p[sequelize.Op.ne] = null,
                                    _p),
                            },
                        })];
                    case 15:
                        _q.sent();
                        status.message = 'processed';
                        status.sent = sent;
                        return [2 /*return*/, status];
                }
            });
        });
    };
    return QueueWorker;
}());
exports.QueueWorker = QueueWorker;
//# sourceMappingURL=queue-worker.js.map