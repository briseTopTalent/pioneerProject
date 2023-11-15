"use strict";
//TODO FIXME: this doesn't work
//import {FB, FacebookApiException} from 'fb';
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
exports.Facebook = void 0;
var models = require('../../models');
var sequelize = models.Sequelize;
var axios = require('axios');
var config = require('../../../config');
var Facebook = /** @class */ (function () {
    function Facebook() {
        var _a;
        this.appId = config.FB_APP_ID;
        this.appSecret = config.FB_APP_SECRET;
        this.facebookVersion = (_a = config.FB_VERSION) !== null && _a !== void 0 ? _a : 'v18.0';
        this.serverDomain = config.SERVER_URL;
        if (config.IS_UNIT_TEST || config.MOCK_FB) {
            console.info("Facebook recognizes UNIT TEST / MOCK_FB: Mocking API calls");
            this.mock = true;
        }
        else {
            console.info("Facebook ready to make PRODUCTION requests");
            this.mock = false;
        }
    }
    Facebook.prototype.setConfiguration = function (appSecret, appId, facebookVersion, serverDomain, mock) {
        this.appSecret = appSecret;
        this.appId = appId;
        this.facebookVersion = facebookVersion;
        this.serverDomain = serverDomain;
        this.mock = mock;
    };
    Facebook.prototype.getConfiguration = function () {
        return {
            appSecret: this.appSecret,
            appId: this.appId,
            mock: this.mock,
            facebookVersion: this.facebookVersion,
            serverDomain: this.serverDomain,
        };
    };
    Facebook.prototype.getMock = function () {
        return this.mock;
    };
    Facebook.prototype.logMessages = function (response, error, userIdList) {
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
    Facebook.prototype.save_tokens = function (user, localityID, fbUserId, fbAccessToken, expiresIn, signedRequest, expirationTime) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, accessToken, url, r, _i, _a, entry, ext;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!['admin', 'super'].includes(user.role)) {
                            throw 'You do not have permission to do that';
                        }
                        userId = fbUserId.replace(/[^0-9_a-z]+/gi, '');
                        accessToken = fbAccessToken.replace(/[^a-z.0-9_\-+]+/gi, '');
                        url = "https://graph.facebook.com/".concat(userId, "/accounts?access_token=").concat(accessToken);
                        console.debug("fetching graph: ".concat(url));
                        return [4 /*yield*/, fetch(url)
                                .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, res.json()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })
                                .then(function (jsonResponse) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, jsonResponse];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })
                                .catch(function (err) {
                                console.error("error: ", err);
                                return null;
                            })];
                    case 1:
                        r = _b.sent();
                        if (r === null) {
                            throw 'Unable to contact the Facebook API';
                        }
                        if (!Array.isArray(r.data)) return [3 /*break*/, 9];
                        return [4 /*yield*/, models.Facebook.destroy({
                                where: {
                                    locality_id: localityID,
                                    _user: user.id,
                                },
                            })];
                    case 2:
                        _b.sent();
                        _i = 0, _a = r.data;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        entry = _a[_i];
                        return [4 /*yield*/, this.extend_token(entry.access_token)];
                    case 4:
                        ext = _b.sent();
                        if (!(ext !== null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, models.Facebook.create({
                                _user: user.id,
                                locality_id: localityID,
                                page_name: entry.name,
                                page_id: entry.id,
                                access_token: entry.access_token,
                                fb_user_id: fbUserId,
                                fb_original_access_token: fbAccessToken,
                                long_lived_access_token: ext.access_token,
                                long_lived_expires_in: ext.expires_in,
                                expires_in: expiresIn,
                                expiration_time: expirationTime,
                                signed_request: signedRequest,
                            })];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, models.Facebook.create({
                            _user: user.id,
                            locality_id: localityID,
                            page_name: entry.name,
                            page_id: entry.id,
                            access_token: entry.access_token,
                            fb_user_id: fbUserId,
                            fb_original_access_token: fbAccessToken,
                            expires_in: expiresIn,
                            expiration_time: expirationTime,
                            signed_request: signedRequest,
                        })];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9:
                        console.debug(JSON.stringify(r.data, null, 2));
                        return [2 /*return*/, 'ok'];
                }
            });
        });
    };
    Facebook.prototype.getLocalityStrings = function (incident) {
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
    Facebook.prototype.getNycLocalityId = function () {
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
    Facebook.prototype.generateIncidentMessage = function (incident) {
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
    Facebook.prototype.post_to_page = function (pageId, in_incident) {
        return __awaiter(this, void 0, void 0, function () {
            var status, incident, r, resp, found, foundRow, pagesPostedTo, msg, _i, resp_1, row, d, seconds, userId, accessToken, pageId_1, url, body, r, str, _a, pagesPostedTo_1, page_id;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        status = [];
                        if (!(typeof in_incident === 'number')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchIncident(in_incident)];
                    case 1:
                        r = _b.sent();
                        if (r === null) {
                            throw 'Couldnt find incident id';
                        }
                        incident = r;
                        return [3 /*break*/, 3];
                    case 2:
                        incident = in_incident;
                        _b.label = 3;
                    case 3:
                        pageId = pageId.replace(/[^0-9_a-z]+/gi, '');
                        return [4 /*yield*/, models.Facebook.findAll({
                                where: {
                                    locality_id: incident.locality,
                                    page_id: pageId,
                                    active: true,
                                },
                                raw: true,
                            })];
                    case 4:
                        resp = _b.sent();
                        found = false;
                        foundRow = {};
                        pagesPostedTo = [];
                        return [4 /*yield*/, this.generateIncidentMessage(incident)];
                    case 5:
                        msg = _b.sent();
                        status.push(['message', msg]);
                        _i = 0, resp_1 = resp;
                        _b.label = 6;
                    case 6:
                        if (!(_i < resp_1.length)) return [3 /*break*/, 9];
                        row = resp_1[_i];
                        d = new Date(row.created_at);
                        seconds = row.long_lived_expires_in;
                        if (seconds === null) {
                            seconds = row.expires_in;
                        }
                        if (!(d.getTime() + (seconds * 1000) > Date.now())) return [3 /*break*/, 8];
                        found = true;
                        foundRow = row;
                        userId = foundRow.fb_user_id;
                        accessToken = foundRow.long_lived_access_token;
                        pageId_1 = foundRow.page_id;
                        if (pagesPostedTo.indexOf(pageId_1) > -1) {
                            status.push(['skipping', "\"".concat(foundRow.page_name, "\"(").concat(foundRow.page_id, "). Already posted to that page")]);
                            console.debug("Skipping page: \"".concat(foundRow.page_name, "\"(").concat(foundRow.page_id, "). We already posted to that page."));
                            return [3 /*break*/, 8];
                        }
                        pagesPostedTo.push(pageId_1);
                        url = "https://graph.facebook.com/".concat(this.facebookVersion, "/").concat(pageId_1, "/feed");
                        console.debug("Fetching graph2: ".concat(url));
                        status.push(['url', url]);
                        body = JSON.stringify({
                            message: msg,
                            access_token: foundRow.long_lived_access_token,
                        });
                        status.push(['body', body]);
                        return [4 /*yield*/, fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: body,
                            })
                                .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, res.json()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })
                                .then(function (jsonResponse) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, jsonResponse];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })
                                .catch(function (err) {
                                console.error("error: ", err);
                                return null;
                            })];
                    case 7:
                        r = _b.sent();
                        if (r === null) {
                            status.push([
                                'error',
                                "Page: \"".concat(foundRow.page_name, "\"(").concat(pageId_1, "): Unable to contact the Facebook API"),
                            ]);
                        }
                        else {
                            status.push([
                                'success',
                                "Posted to \"".concat(foundRow.page_name, "\" successfully"),
                            ]);
                            status.push(['response', JSON.stringify(r, null, 2)]);
                            console.debug(JSON.stringify(r, null, 2));
                        }
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9:
                        str = '';
                        for (_a = 0, pagesPostedTo_1 = pagesPostedTo; _a < pagesPostedTo_1.length; _a++) {
                            page_id = pagesPostedTo_1[_a];
                            str += "".concat(page_id, ",");
                        }
                        status.push(['pages_posted_to', str]);
                        this.logStatus(status, incident);
                        return [2 /*return*/, status];
                }
            });
        });
    };
    Facebook.prototype.fetchIncident = function (id) {
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
    Facebook.prototype.logStatus = function (status, incident) {
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
                                err += tuple[0] + "=>" + tuple[1] + "\n";
                                continue;
                            }
                            m += tuple[0] + "=>" + tuple[1] + "\n";
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
    Facebook.prototype.extend_token = function (fbAccessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, url, r, resp;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessToken = fbAccessToken.replace(/[^a-z.0-9_\-+]+/gi, '');
                        url = "https://graph.facebook.com/".concat(this.facebookVersion, "/oauth/access_token?") +
                            "grant_type=fb_exchange_token&" +
                            "client_id=".concat(this.appId, "&") +
                            "client_secret=".concat(this.appSecret, "&") +
                            "fb_exchange_token=".concat(accessToken);
                        console.debug("fetching extend token url: ".concat(url));
                        return [4 /*yield*/, fetch(url)
                                .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, res.json()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })
                                .then(function (jsonResponse) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, jsonResponse];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })
                                .catch(function (err) {
                                console.error("error: ", err);
                                return null;
                            })];
                    case 1:
                        r = _a.sent();
                        console.debug("extend token response: ", JSON.stringify(r, null, 2));
                        if (r === null) {
                            return [2 /*return*/, null];
                        }
                        resp = {
                            access_token: r.access_token,
                            token_type: r.token_type,
                            expires_in: r.expires_in,
                        };
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    Facebook.prototype.is_locality_expired = function (localityId) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, _i, resp_2, row, d, seconds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models.Facebook.findAll({
                            where: {
                                locality_id: localityId,
                                active: true,
                            },
                            raw: true,
                        })];
                    case 1:
                        resp = _a.sent();
                        for (_i = 0, resp_2 = resp; _i < resp_2.length; _i++) {
                            row = resp_2[_i];
                            d = new Date(row.created_at);
                            seconds = row.long_lived_expires_in;
                            if (seconds === 0 || seconds === null) {
                                seconds = row.expires_in;
                            }
                            if (d.getTime() + (seconds * 1000) > Date.now()) {
                                return [2 /*return*/, false];
                            }
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Facebook.prototype.getUser = function (id) {
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
    Facebook.prototype.available_and_active_pages = function (localityId) {
        return __awaiter(this, void 0, void 0, function () {
            var p, resp, _i, resp_3, row, d, seconds, fb, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        p = [];
                        return [4 /*yield*/, models.Facebook.findAll({
                                where: {
                                    locality_id: localityId,
                                    active: true,
                                },
                                raw: true,
                            })];
                    case 1:
                        resp = _a.sent();
                        _i = 0, resp_3 = resp;
                        _a.label = 2;
                    case 2:
                        if (!(_i < resp_3.length)) return [3 /*break*/, 5];
                        row = resp_3[_i];
                        d = new Date(row.created_at);
                        seconds = row.long_lived_expires_in;
                        if (seconds === 0 || seconds === null) {
                            seconds = row.expires_in;
                        }
                        console.debug({ seconds: seconds, d: new Date(d.getTime() + seconds * 1000) });
                        if (d.getTime() + (seconds * 1000) < Date.now()) {
                            return [3 /*break*/, 4];
                        }
                        fb = {
                            created_by_name: '',
                            created_by_email: '',
                            expiration_date: new Date(d.getTime() + (seconds * 1000)),
                            locality_id: localityId,
                            page_name: row.page_name,
                            page_id: row.page_id,
                        };
                        return [4 /*yield*/, this.getUser(row._user)];
                    case 3:
                        user = _a.sent();
                        if (user !== null) {
                            fb.created_by_name = [user.first_name, user.last_name].join(' ');
                            fb.created_by_email = user.email;
                        }
                        else {
                            fb.created_by_name = 'unknown';
                            fb.created_by_email = 'unknown';
                        }
                        p.push(fb);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, p];
                }
            });
        });
    };
    return Facebook;
}());
exports.Facebook = Facebook;
//# sourceMappingURL=facebook.js.map