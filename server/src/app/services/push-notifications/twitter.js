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
exports.Twitter = void 0;
var models = require('../../models');
var sequelize = models.Sequelize;
var axios = require('axios');
var config = require('../../../config');
var TwitterApi = require('twitter-api-v2').TwitterApi;
var Twitter = /** @class */ (function () {
    function Twitter() {
        var _a;
        this.appId = config.TWITTER_APP_ID;
        this.appSecret = config.TWITTER_APP_SECRET;
        this.twitterVersion = (_a = config.TWITTER_VERSION) !== null && _a !== void 0 ? _a : 'v18.0';
        if (config.IS_UNIT_TEST || config.MOCK_TWITTER) {
            console.info("Twitter recognizes UNIT TEST / MOCK_TWITTER: Mocking API calls");
            this.mock = true;
        }
        else {
            console.info("Twitter ready to make PRODUCTION requests");
            this.mock = false;
        }
    }
    Twitter.prototype.setConfiguration = function (appSecret, appId, twitterVersion, mock) {
        this.appSecret = appSecret;
        this.appId = appId;
        this.twitterVersion = twitterVersion;
        this.mock = mock;
    };
    Twitter.prototype.getConfiguration = function () {
        return {
            appSecret: this.appSecret,
            appId: this.appId,
            mock: this.mock,
            twitterVersion: this.twitterVersion,
        };
    };
    Twitter.prototype.getMock = function () {
        return this.mock;
    };
    Twitter.prototype.logMessages = function (response, error, userIdList) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models.PushNotificationsQueueLog.create({
                            response_message: response,
                            error_message: error,
                            userIdList: JSON.stringify(userIdList),
                        })];
                    case 1:
                        row = _a.sent();
                        return [4 /*yield*/, row.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Twitter.prototype.save_tokens = function (user, pageName) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                if (!['admin', 'super'].includes(user.role)) {
                    throw 'You do not have permission to do that';
                }
                page = pageName.replace(/[^0-9_a-z]+/gi, '');
                return [2 /*return*/, 'ok'];
            });
        });
    };
    Twitter.prototype.is_locality_expired = function (localityId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, false];
            });
        });
    };
    Twitter.prototype.getCredentialsForIncident = function (in_incident) {
        return __awaiter(this, void 0, void 0, function () {
            var incident, r_1, twModel, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof in_incident === 'number')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchIncident(in_incident)];
                    case 1:
                        r_1 = _a.sent();
                        if (r_1 === null) {
                            return [2 /*return*/, null];
                        }
                        incident = r_1;
                        return [3 /*break*/, 3];
                    case 2:
                        incident = in_incident;
                        _a.label = 3;
                    case 3:
                        twModel = {
                            TWITTER_API_KEY: '',
                            TWITTER_API_KEY_SECRET: '',
                            TWITTER_API_ACCESS_TOKEN: '',
                            TWITTER_API_ACCESS_TOKEN_SECRET: '',
                            TWITTER_API_BEARER_TOKEN: '',
                        };
                        return [4 /*yield*/, models.Locality.findAll({
                                where: {
                                    id: incident.locality,
                                },
                                raw: true,
                            })];
                    case 4:
                        r = _a.sent();
                        if (!r || r.length === 0) {
                            return [2 /*return*/, null];
                        }
                        twModel.TWITTER_API_KEY = r[0].twitter_api_key;
                        twModel.TWITTER_API_KEY_SECRET = r[0].twitter_api_secret;
                        twModel.TWITTER_API_ACCESS_TOKEN = r[0].twitter_access_token;
                        twModel.TWITTER_API_ACCESS_TOKEN_SECRET = r[0].twitter_access_token_secret;
                        twModel.TWITTER_API_BEARER_TOKEN = r[0].twitter_bearer_token;
                        return [2 /*return*/, twModel];
                }
            });
        });
    };
    Twitter.prototype.makePost = function (in_incident) {
        return __awaiter(this, void 0, void 0, function () {
            var status, incident, r, row, tweet, client, rwClient, res, errMsg, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = [];
                        if (!(typeof in_incident === 'number')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchIncident(in_incident)];
                    case 1:
                        r = _a.sent();
                        if (r === null) {
                            throw 'Couldnt find incident by id';
                        }
                        incident = r;
                        return [3 /*break*/, 3];
                    case 2:
                        incident = in_incident;
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getCredentialsForIncident(incident)];
                    case 4:
                        row = _a.sent();
                        if (row === null) {
                            status.push(['no-op', 'no credentials for incident']);
                            return [2 /*return*/, status];
                        }
                        return [4 /*yield*/, this.generateIncidentMessage(incident)];
                    case 5:
                        tweet = _a.sent();
                        client = new TwitterApi({
                            appKey: row.TWITTER_API_KEY,
                            appSecret: row.TWITTER_API_KEY_SECRET,
                            accessToken: row.TWITTER_API_ACCESS_TOKEN,
                            accessSecret: row.TWITTER_API_ACCESS_TOKEN_SECRET,
                            bearerToken: row.TWITTER_API_BEARER_TOKEN,
                        });
                        rwClient = client.readWrite;
                        res = null;
                        errMsg = '';
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        status.push(['posting', tweet]);
                        return [4 /*yield*/, rwClient.v2.tweet(tweet).catch(function (error) {
                                console.debug(JSON.stringify(error, null, 2));
                                var copy = JSON.parse(JSON.stringify(error));
                                status.push([
                                    'error',
                                    "status: ".concat(copy.error.status, ", code: ").concat(copy.code, ". message: ").concat(copy.error.detail),
                                ]);
                                return null;
                            })];
                    case 7:
                        res = _a.sent();
                        status.push(['postOnTwitter response', JSON.stringify(res, null, 2)]);
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        if (typeof error_1 === 'string') {
                            status.push(['error', error_1]);
                        }
                        else if ('message' in error_1) {
                            status.push(['error', error_1.message]);
                        }
                        else {
                            status.push(['error', JSON.stringify(error_1)]);
                        }
                        console.error(error_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, status];
                }
            });
        });
    };
    Twitter.prototype.fetchIncident = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models.Incident.findAll({
                            where: {
                                id: id,
                            },
                            raw: true,
                        })];
                    case 1:
                        r = _a.sent();
                        if (r && r.length) {
                            return [2 /*return*/, r[0]];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Twitter.prototype.generateIncidentMessage = function (incident) {
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
                            str = locStrings[1] + ' ';
                        }
                        str += "*".concat(String(incident.field1_value).toUpperCase(), "*");
                        return [4 /*yield*/, this.getNycLocalityId()];
                    case 2:
                        nycLocalityID = _a.sent();
                        if (typeof incident.field3_value !== 'undefined' &&
                            incident.field3_value !== null &&
                            String(incident.field3_value).length > 0) {
                            if (nycLocalityID === incident.locality ||
                                isNaN(parseInt(incident.field3_value, 10)) === false) {
                                str += " Box ".concat(incident.field3_value, "\n");
                            }
                            else {
                                str += " ".concat(incident.field3_value, "\n");
                            }
                        }
                        else {
                            str += "\n";
                        }
                        str += incident.address + '\n';
                        str += String(incident.field2_value).toUpperCase();
                        return [2 /*return*/, str];
                }
            });
        });
    };
    Twitter.prototype.getLocalityStrings = function (incident) {
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
                        if (!(typeof incident.sub_locality !== 'undefined' &&
                            incident.sub_locality !== null)) return [3 /*break*/, 3];
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
    Twitter.prototype.getNycLocalityId = function () {
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
    Twitter.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models.User.findOne({
                            where: {
                                id: id,
                            },
                            raw: true,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Twitter.prototype.logStatus = function (status, incident) {
        return __awaiter(this, void 0, void 0, function () {
            var m, err, _i, status_1, tuple;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        m = '';
                        err = '';
                        for (_i = 0, status_1 = status; _i < status_1.length; _i++) {
                            tuple = status_1[_i];
                            if (tuple[0].match(/^error/i)) {
                                err += tuple[0] + '=>' + tuple[1] + '\n';
                                continue;
                            }
                            m += tuple[0] + '=>' + tuple[1] + '\n';
                        }
                        return [4 /*yield*/, models.PushNotificationsQueueLog.create({
                                incident_id: incident.id,
                                response_message: m,
                                error_message: err,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Twitter.prototype.available_and_active_pages = function (localityId) {
        return __awaiter(this, void 0, void 0, function () {
            var p, resp, _i, resp_1, row, fields, _a, fields_1, field, tp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        p = [];
                        return [4 /*yield*/, models.Locality.findAll({
                                where: {
                                    id: localityId,
                                },
                                raw: true,
                            })];
                    case 1:
                        resp = _b.sent();
                        for (_i = 0, resp_1 = resp; _i < resp_1.length; _i++) {
                            row = resp_1[_i];
                            fields = [
                                'twitter_api_key',
                                'twitter_api_secret',
                                'twitter_access_token',
                                'twitter_access_token_secret',
                                'twitter_bearer_token',
                            ];
                            for (_a = 0, fields_1 = fields; _a < fields_1.length; _a++) {
                                field = fields_1[_a];
                                if (!row[field] || String(row[field]).length === 0) {
                                    return [2 /*return*/, []];
                                }
                            }
                            tp = {
                                locality_id: localityId,
                                page_name: row.twitter_page_name,
                                page_id: row.id,
                            };
                            p.push(tp);
                        }
                        return [2 /*return*/, p];
                }
            });
        });
    };
    return Twitter;
}());
exports.Twitter = Twitter;
//# sourceMappingURL=twitter.js.map