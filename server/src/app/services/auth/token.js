'use strict';
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
exports.getToken = exports.refresh = void 0;
var jwt = require('jsonwebtoken');
var config = require('../../../config');
var models = require('../../models');
var sequelize = models.sequelize;
var adminRoles = ['super', 'admin'];
var TokenGenerator = /** @class */ (function () {
    function TokenGenerator(secretOrPrivateKey, secretOrPublicKey, options) {
        this.secretOrPrivateKey = secretOrPrivateKey;
        this.secretOrPublicKey = secretOrPublicKey;
        this.options = options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
    }
    TokenGenerator.prototype.sign = function (payload, signOptions) {
        var jwtSignOptions = Object.assign({}, signOptions, this.options);
        return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
    };
    // refreshOptions.verify = options you would use with verify function
    // refreshOptions.jwtid = contains the id for the new token
    TokenGenerator.prototype.refresh = function (token, refreshOptions) {
        var payload = jwt.verify(token, this.secretOrPrivateKey, 
        //this.secretOrPublicKey,
        refreshOptions.verify);
        delete payload.iat;
        delete payload.exp;
        delete payload.nbf;
        delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
        var jwtSignOptions = Object.assign({}, this.options, {
            jwtid: refreshOptions.jwtid,
        });
        // The first signing converted all needed options into claims, they are already in the payload
        return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
    };
    return TokenGenerator;
}());
var getTokenGenerator = function () {
    var options = {
        algorithm: 'HS256',
        keyid: '1',
        noTimestamp: false,
        //expiresIn: `${60 * 24}m`,
        //notBefore: '2s',
    };
    return new TokenGenerator(config.JWT_SECRET, '', options);
};
var sign = function (payload, options) {
    var tokenGenerator = getTokenGenerator();
    return tokenGenerator.sign(payload, options);
};
var refresh = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenGenerator;
    return __generator(this, function (_a) {
        tokenGenerator = getTokenGenerator();
        return [2 /*return*/, tokenGenerator.refresh(token, {
                verify: { audience: 'firewire', issuer: 'firewirebackend' },
                jwtid: '2',
            })];
    });
}); };
exports.refresh = refresh;
var getToken = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var token, refreshToken, role, data;
    return __generator(this, function (_a) {
        token = sign({ id: user.id, email: user.email, role: user.role }, {
            issuer: 'firewirebackend',
        });
        refreshToken = sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, {
            audience: 'firewire',
            issuer: 'firewirebackend',
            jwtid: '2',
        });
        role = 'basic_user';
        if (user.role === 'super' || user.role === 'admin') {
            role = user.role;
        }
        data = {
            verified: user.verified,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: role,
            isAdmin: adminRoles.includes(user.role) || false,
            token: token,
            refreshToken: refreshToken,
            token_type: 'jwt',
            expiresIn: 0,
        };
        return [2 /*return*/, data];
    });
}); };
exports.getToken = getToken;
//# sourceMappingURL=token.js.map