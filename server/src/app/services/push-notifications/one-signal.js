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
exports.OneSignal = void 0;
var models = require('../../models');
var sequelize = models.Sequelize;
var axios = require('axios');
var config = require('../../../config');
var OneSignal = /** @class */ (function () {
    function OneSignal() {
        this.apiKey = config.ONE_SIGNAL_API_KEY;
        this.appId = config.ONE_SIGNAL_APP_ID;
        if (config.IS_UNIT_TEST || config.MOCK_ONE_SIGNAL) {
            console.info("OneSignal recognizes UNIT TEST / MOCK_ONE_SIGNAL: Mocking API calls");
            this.mock = true;
            /**
             * Doesn't necessarily have to be a valid endpoint. The point is just
             * that we're hitting something besides production
             */
            this.url = 'https://fireweb.ddns.net/api/v1/mock-notifications';
        }
        else {
            console.info("OneSignal ready to make PRODUCTION requests");
            this.mock = false;
            this.url = 'https://onesignal.com/api/v1/notifications';
        }
    }
    OneSignal.prototype.setConfiguration = function (apiKey, appId, url, mock) {
        this.apiKey = apiKey;
        this.appId = appId;
        this.url = url;
        this.mock = mock;
    };
    OneSignal.prototype.getConfiguration = function () {
        return {
            apiKey: this.apiKey,
            appId: this.appId,
            url: this.url,
            mock: this.mock,
        };
    };
    OneSignal.prototype.getMock = function () {
        return this.mock;
    };
    OneSignal.prototype.logMessages = function (response, error, userIdList) {
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
    OneSignal.prototype.send = function (userIdList, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var userIds, _i, userIdList_1, uid, options;
                        var _this = this;
                        return __generator(this, function (_a) {
                            userIds = [];
                            for (_i = 0, userIdList_1 = userIdList; _i < userIdList_1.length; _i++) {
                                uid = userIdList_1[_i];
                                userIds.push(String(uid));
                            }
                            options = {
                                method: 'POST',
                                url: this.url,
                                headers: {
                                    accept: 'application/json',
                                    Authorization: "Basic ".concat(this.apiKey),
                                    'content-type': 'application/json',
                                },
                                data: {
                                    app_id: this.appId,
                                    contents: {
                                        en: msg,
                                    },
                                    name: 'notification',
                                    include_external_user_ids: userIds,
                                },
                            };
                            if (this.mock) {
                                this.logMessages(JSON.stringify({ mocked: true, options: options }), 'none', userIdList);
                                resolve({
                                    error: false,
                                    message: 'ok/mocked',
                                    response: JSON.stringify({ mocked: true, options: options }),
                                    userCount: userIdList.length,
                                });
                                return [2 /*return*/];
                            }
                            axios
                                .request(options)
                                .then(function (response) {
                                _this.logMessages(JSON.stringify({ mocked: false, options: options, response: '', }), 'none', userIdList);
                                resolve({
                                    error: false,
                                    message: 'ok',
                                    response: '',
                                    userCount: userIdList.length,
                                });
                            })
                                .catch(function (error) {
                                console.error(error);
                                _this.logMessages(JSON.stringify({ mocked: false, options: options }), JSON.stringify(error), userIdList);
                                var msg = 'error';
                                if (error instanceof Error) {
                                    msg = error.message;
                                }
                                if (typeof error === 'string') {
                                    msg = error;
                                }
                                reject({
                                    error: true,
                                    message: msg,
                                    response: '',
                                    userCount: userIdList.length,
                                });
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    return OneSignal;
}());
exports.OneSignal = OneSignal;
//# sourceMappingURL=one-signal.js.map