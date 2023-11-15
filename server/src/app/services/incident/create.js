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
exports.createIncident = void 0;
var models = require('../../models');
var createRedisIncident = require('../../../database/redis').createRedisIncident;
var addressParser = require('../../../utils/addressParser');
var incident_notifier_1 = require("../push-notifications/incident-notifier");
var facebook_1 = require("../push-notifications/facebook");
var twitter_1 = require("../push-notifications/twitter");
var createIncident = function (userId, incident, send_push_notification, facebook_pages, twitter) { return __awaiter(void 0, void 0, void 0, function () {
    var push_notifications_queued, d, newD, notifier, pages, _i, facebook_pages_1, p, tmp, fb, _a, pages_1, page, r, twitterLib, r, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                push_notifications_queued = false;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                return [4 /*yield*/, models.Locality.findOne({
                        where: { id: incident.locality },
                        attributes: ['name'],
                    })];
            case 2:
                d = _b.sent();
                if (!d) {
                    return [2 /*return*/, {
                            error: true,
                            message: "The specified locality doesn't exist.",
                            data: {},
                            push_notifications_queued: push_notifications_queued,
                        }];
                }
                return [4 /*yield*/, models.Incident.create(incident)];
            case 3:
                newD = _b.sent();
                if (!newD) {
                    return [2 /*return*/, {
                            error: true,
                            message: "Unable to create incident",
                            data: {},
                            push_notifications_queued: push_notifications_queued,
                        }];
                }
                return [4 /*yield*/, createRedisIncident(newD.id)];
            case 4:
                _b.sent();
                if (send_push_notification) {
                    notifier = new incident_notifier_1.IncidentNotifier();
                    notifier.createRowsInPushNotificationsTable(newD);
                    push_notifications_queued = true;
                }
                if (!facebook_pages.length) return [3 /*break*/, 8];
                pages = [];
                for (_i = 0, facebook_pages_1 = facebook_pages; _i < facebook_pages_1.length; _i++) {
                    p = facebook_pages_1[_i];
                    tmp = String(p);
                    tmp = tmp.replace(/[^0-9a-z_-]+/gi, '');
                    if (tmp.length === 0 || pages.indexOf(tmp) > -1) {
                        continue;
                    }
                    pages.push(tmp);
                }
                fb = new facebook_1.Facebook();
                _a = 0, pages_1 = pages;
                _b.label = 5;
            case 5:
                if (!(_a < pages_1.length)) return [3 /*break*/, 8];
                page = pages_1[_a];
                return [4 /*yield*/, fb.post_to_page(page, incident)];
            case 6:
                r = _b.sent();
                console.debug(r);
                _b.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8:
                if (!twitter.length) return [3 /*break*/, 10];
                twitterLib = new twitter_1.Twitter();
                return [4 /*yield*/, twitterLib.makePost(incident)];
            case 9:
                r = _b.sent();
                console.debug(r);
                _b.label = 10;
            case 10: return [2 /*return*/, {
                    error: false,
                    data: {},
                    message: 'success',
                    push_notifications_queued: push_notifications_queued,
                }];
            case 11:
                err_1 = _b.sent();
                if (typeof err_1 === 'string') {
                    return [2 /*return*/, {
                            error: true,
                            data: err_1,
                            message: err_1,
                            push_notifications_queued: push_notifications_queued,
                        }];
                }
                if (err_1 instanceof Error) {
                    return [2 /*return*/, {
                            error: true,
                            data: err_1,
                            message: err_1.message,
                            push_notifications_queued: push_notifications_queued,
                        }];
                }
                return [2 /*return*/, {
                        error: true,
                        data: {},
                        message: String(err_1),
                        push_notifications_queued: push_notifications_queued,
                    }];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.createIncident = createIncident;
//# sourceMappingURL=create.js.map