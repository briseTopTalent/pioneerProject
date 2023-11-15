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
exports.verifyAppleToken = void 0;
var bcrypt = require('bcryptjs');
var OAuth2Client = require('google-auth-library').OAuth2Client;
var url = require('url');
var models = require('../../models');
var dd = require('../../../utils').dd;
var config = require('../../../config');
var sequelize = models.sequelize;
var tokenizer = require('../../../utils/tokenizer');
var UserService = require('../../services/user');
var getToken = require('./token').getToken;
var LoginAdmin = require('../../services/auth/login');
var crypto = require('crypto');
var adminRoles = ['super', 'admin'];
var axios = require('axios');
var jwt = require('jsonwebtoken');
var jwksClient = require('jwks-rsa');
function getApplePublicKeys() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get('https://appleid.apple.com/auth/keys')];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data.keys];
            }
        });
    });
}
function get_user(email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug('get_user:', email);
                    email = String(email).toLowerCase();
                    return [4 /*yield*/, models.User.findOne({
                            where: sequelize.where(sequelize.fn('lower', sequelize.col('email')), email),
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var loginUser = function (email, first_name, last_name, phone_number) { return __awaiter(void 0, void 0, void 0, function () {
    var user, status_1, user_record, response, tokenData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = String(email).toLowerCase();
                return [4 /*yield*/, models.User.findOne({
                        where: sequelize.where(sequelize.fn('lower', sequelize.col('email')), email),
                    })];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 7];
                return [4 /*yield*/, LoginAdmin.copyBackupDBUserToThisDB(email)];
            case 2:
                status_1 = _a.sent();
                return [4 /*yield*/, get_user(email)];
            case 3:
                user_record = _a.sent();
                if (!!user_record) return [3 /*break*/, 6];
                return [4 /*yield*/, UserService.CreateUser(first_name, last_name, email, // email
                    phone_number, // phone
                    crypto.randomBytes(32).toString('base64'), // password
                    'user' // title
                    )];
            case 4:
                response = _a.sent();
                return [4 /*yield*/, models.User.findOne({
                        where: sequelize.where(sequelize.fn('lower', sequelize.col('email')), email),
                    })];
            case 5:
                user_record = _a.sent();
                _a.label = 6;
            case 6:
                user = user_record;
                _a.label = 7;
            case 7: return [4 /*yield*/, getToken(user)];
            case 8:
                tokenData = _a.sent();
                // update user login time
                return [4 /*yield*/, models.User.update({
                        last_login: Date.now(),
                    }, {
                        where: sequelize.where(sequelize.fn('lower', sequelize.col('email')), email),
                    })];
            case 9:
                // update user login time
                _a.sent();
                return [2 /*return*/, { user: user, tokenData: tokenData }];
        }
    });
}); };
function verifyAppleToken(token) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            console.log("TOKEN: \"".concat(token, "\""));
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    function getKey(header, callback) {
                        client.getSigningKey(header.kid, function (err, key) {
                            var signingKey = key.publicKey || key.rsaPublicKey;
                            callback(null, signingKey);
                        });
                    }
                    var appleKeys, client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getApplePublicKeys()];
                            case 1:
                                appleKeys = _a.sent();
                                client = jwksClient({
                                    jwksUri: 'https://appleid.apple.com/auth/keys',
                                });
                                jwt.verify(token, getKey, { algorithms: ['RS256'] }, function (err, decoded) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var userId, email, first_name, last_name, phone_number, response, tokenData;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (err) {
                                                        // Handle verification error
                                                        reject({
                                                            status: 'error',
                                                            data: null,
                                                            message: 'failed to verify token',
                                                            error: err,
                                                        });
                                                        console.debug(JSON.stringify({ err: err }, null, 2));
                                                        return [2 /*return*/];
                                                    }
                                                    userId = decoded.sub;
                                                    console.debug(JSON.stringify({ decoded: decoded }, null, 2));
                                                    email = decoded.email;
                                                    first_name = 'user';
                                                    last_name = 'user';
                                                    phone_number = '1112221234';
                                                    return [4 /*yield*/, loginUser(email, first_name, last_name, phone_number)];
                                                case 1:
                                                    response = _a.sent();
                                                    return [4 /*yield*/, getToken(response.user)];
                                                case 2:
                                                    tokenData = _a.sent();
                                                    resolve(tokenData);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                });
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.verifyAppleToken = verifyAppleToken;
//# sourceMappingURL=apple.js.map