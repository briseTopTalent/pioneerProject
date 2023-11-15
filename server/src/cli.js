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
var CURRENT_DIR = __dirname;
var models = require(CURRENT_DIR + '/app/models/index');
var one_signal_1 = require("./app/services/push-notifications/one-signal");
var facebook_1 = require("./app/services/push-notifications/facebook");
var twitter_1 = require("./app/services/push-notifications/twitter");
var NodeChildProcess = require('child_process');
var bcrypt = require('bcryptjs');
var SocialMedia = require('./app/services/push-notifications/social-media');
function handle_user(args) {
    return __awaiter(this, void 0, void 0, function () {
        var verbose, generate_pw, mode, match, user_id, user_email, _i, args_1, arg, user, forgotPw, resp, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verbose = false;
                    generate_pw = '';
                    mode = '';
                    match = null;
                    user_id = null;
                    user_email = null;
                    for (_i = 0, args_1 = args; _i < args_1.length; _i++) {
                        arg = args_1[_i];
                        if (arg.match(/^--verbose/)) {
                            verbose = true;
                            continue;
                        }
                        if (arg.match(/^--send-reset-email$/)) {
                            mode = 'send-reset-email';
                            continue;
                        }
                        if (arg.match(/^--update-pw$/)) {
                            mode = 'update-pw';
                            continue;
                        }
                        match = arg.match(/^--email=(.*)$/);
                        if (match) {
                            user_email = match[1];
                            continue;
                        }
                        if (arg.match(/^--generate-pw$/)) {
                            mode = 'generate-pw';
                            continue;
                        }
                        match = arg.match(/^--password=(.*)$/);
                        if (match) {
                            generate_pw = match[1];
                            continue;
                        }
                        match = arg.match(/^--user-id=(.*)$/);
                        if (match) {
                            if (isNaN(parseInt(match[1], 10))) {
                                console.error("You must specify a valid user id of *ONLY* numbers. Instead, we got: \"".concat(match[1], "\""));
                                return [2 /*return*/, -1];
                            }
                            user_id = parseInt(match[1], 10);
                        }
                    }
                    if (!(mode === 'send-reset-email')) return [3 /*break*/, 6];
                    if (user_id === null && user_email === null) {
                        console.error("You must specify a valid --user-id=N or --email=EE@CCC");
                        return [2 /*return*/, -1];
                    }
                    user = null;
                    if (!user_id) return [3 /*break*/, 2];
                    return [4 /*yield*/, models.User.findOne({
                            where: {
                                id: user_id,
                            },
                            raw: true,
                        })];
                case 1:
                    user = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, models.User.findOne({
                        where: {
                            email: String(user_email).toLowerCase(),
                        },
                        raw: true,
                    })];
                case 3:
                    user = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!user) {
                        console.error("Couldn't find a user with that ID. Exiting...");
                        return [2 /*return*/, -1];
                    }
                    user_id = user.id;
                    user_email = user.email;
                    console.info("Found user: [".concat(user_id, "](").concat(user_email, ")..."));
                    forgotPw = require('./app/services/user/forgotPw');
                    return [4 /*yield*/, forgotPw(user_email, true)];
                case 5:
                    resp = _a.sent();
                    console.log(resp);
                    return [2 /*return*/, 0];
                case 6:
                    if (!(mode === 'update-pw')) return [3 /*break*/, 9];
                    if (generate_pw.length === 0) {
                        console.error('You must specify an password with: --password=NNN');
                        return [2 /*return*/, -1];
                    }
                    if (user_id === null) {
                        console.error('You must specify a user-id with: --user-id=N');
                        return [2 /*return*/, -1];
                    }
                    console.info('Looking up user in database...');
                    return [4 /*yield*/, models.User.findOne({
                            where: {
                                id: user_id,
                            },
                            raw: true,
                        })];
                case 7:
                    user = _a.sent();
                    if (!user) {
                        console.error("Couldn't find a user with that ID. Exiting...");
                        return [2 /*return*/, -1];
                    }
                    console.info("Found user by ID: [".concat(user_id, "](").concat(user.email, ")..."));
                    console.info("Updating...");
                    return [4 /*yield*/, models.User.update({
                            password: bcrypt.hashSync(generate_pw, 8),
                        }, {
                            where: {
                                id: user_id,
                            },
                        })];
                case 8:
                    _a.sent();
                    console.log('Done updating user password');
                    return [2 /*return*/, 0];
                case 9:
                    if (mode === 'generate-pw') {
                        if (generate_pw.length === 0) {
                            console.error('You must specify an password with: --password=NNN');
                            return [2 /*return*/, -1];
                        }
                        console.log(bcrypt.hashSync(generate_pw, 8));
                        return [2 /*return*/, 0];
                    }
                    return [2 /*return*/, 0];
            }
        });
    });
}
function handle_one_signal(args) {
    return __awaiter(this, void 0, void 0, function () {
        var ONE_SIGNAL_APP_ID, ONE_SIGNAL_API_KEY, _i, args_2, arg, matches, _a, args_3, arg, matches, lib, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    ONE_SIGNAL_APP_ID = '';
                    ONE_SIGNAL_API_KEY = '';
                    for (_i = 0, args_2 = args; _i < args_2.length; _i++) {
                        arg = args_2[_i];
                        matches = arg.match(/^--onesignal-app-id=(.*)$/);
                        if (matches) {
                            ONE_SIGNAL_APP_ID = matches[1];
                        }
                        matches = arg.match(/^--onesignal-api-key=(.*)$/);
                        if (matches) {
                            ONE_SIGNAL_API_KEY = matches[1];
                        }
                    }
                    _a = 0, args_3 = args;
                    _d.label = 1;
                case 1:
                    if (!(_a < args_3.length)) return [3 /*break*/, 4];
                    arg = args_3[_a];
                    matches = arg.match(/^--test-onesignal=([0-9]{1,})$/);
                    if (!matches) return [3 /*break*/, 3];
                    if (ONE_SIGNAL_API_KEY.length == 0) {
                        console.error("Missing API KEY. Pass in: --onesignal-api-key=XXX");
                        return [2 /*return*/, -1];
                    }
                    if (ONE_SIGNAL_APP_ID.length == 0) {
                        console.error("Missing APP ID. Pass in: --onesignal-app-id=XXX");
                        return [2 /*return*/, -1];
                    }
                    console.debug("test onesignal user id: ".concat(matches[1]));
                    lib = new one_signal_1.OneSignal();
                    lib.setConfiguration(ONE_SIGNAL_API_KEY, ONE_SIGNAL_APP_ID, 'https://onesignal.com/api/v1/notifications', false);
                    _c = (_b = console).debug;
                    return [4 /*yield*/, lib.send([parseInt(matches[1], 10)], 'This is a test')];
                case 2:
                    _c.apply(_b, [_d.sent()]);
                    _d.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, 0];
            }
        });
    });
}
function handle_twitter_post(args) {
    return __awaiter(this, void 0, void 0, function () {
        var verbose, tweet, mode, match, incidentId, _i, args_4, arg, lib, response, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verbose = false;
                    tweet = '';
                    mode = '';
                    match = null;
                    incidentId = -1;
                    for (_i = 0, args_4 = args; _i < args_4.length; _i++) {
                        arg = args_4[_i];
                        if (arg.match(/^--verbose/)) {
                            verbose = true;
                            continue;
                        }
                        if (arg.match(/^--twitter-get-creds-for-incident/)) {
                            mode = 'get-creds-for-incident';
                            continue;
                        }
                        match = arg.match(/^--twitter-incident-id=(.*)$/);
                        if (match) {
                            incidentId = parseInt(match[1], 10);
                            continue;
                        }
                        if (arg.match(/^--twitter-tweet/)) {
                            mode = 'tweet';
                            continue;
                        }
                        //match = arg.match(/^--tweet=(.*)$/);
                        //if (match) {
                        //  tweet = match[1];
                        //  continue;
                        //}
                    }
                    lib = new twitter_1.Twitter();
                    if (!(mode === 'tweet')) return [3 /*break*/, 2];
                    if (incidentId === -1 || isNaN(incidentId)) {
                        console.error("you must provide --twitter-incident-id=(.*)");
                        return [2 /*return*/, -1];
                    }
                    console.log("Sending tweet for incidentId: \"".concat(incidentId, "\""));
                    return [4 /*yield*/, lib.makePost(incidentId)];
                case 1:
                    response = _a.sent();
                    console.log(JSON.stringify(response, null, 2));
                    return [2 /*return*/, 0];
                case 2:
                    if (!(mode === 'get-creds-for-incident')) return [3 /*break*/, 4];
                    if (incidentId === -1 || isNaN(incidentId)) {
                        console.error("you must provide --twitter-incident-id=(.*)");
                        return [2 /*return*/, -1];
                    }
                    console.log("Getting credentials for incident id: \"".concat(incidentId, "\""));
                    return [4 /*yield*/, lib.getCredentialsForIncident(incidentId)];
                case 3:
                    r = _a.sent();
                    console.log(r);
                    console.log('------------------------------------------------------');
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/, 0];
            }
        });
    });
}
function handle_facebook(args) {
    return __awaiter(this, void 0, void 0, function () {
        var verbose, mode, userId, accessToken, match, locality, content, page_name, pageId, argsLocalityID, _i, args_5, arg, row, url, r, lib, int_locality_id, is_expired, lib, incident, r, _a, r_1, line, lib, localityId, r, _b, r_2, row;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    verbose = false;
                    mode = '';
                    userId = '';
                    accessToken = '';
                    match = '';
                    locality = '';
                    content = '';
                    page_name = '';
                    pageId = '';
                    argsLocalityID = '';
                    _i = 0, args_5 = args;
                    _c.label = 1;
                case 1:
                    if (!(_i < args_5.length)) return [3 /*break*/, 5];
                    arg = args_5[_i];
                    if (arg.match(/^--verbose/)) {
                        verbose = true;
                        return [3 /*break*/, 4];
                    }
                    if (arg.match(/^--fb-post/)) {
                        mode = 'post';
                        return [3 /*break*/, 4];
                    }
                    if (arg.match(/^--fb-dump-available/)) {
                        mode = 'dump-available';
                        return [3 /*break*/, 4];
                    }
                    if (!arg.match(/^--fb-dump$/)) return [3 /*break*/, 3];
                    return [4 /*yield*/, models.Facebook.findAll({ raw: true })];
                case 2:
                    row = _c.sent();
                    console.log(JSON.stringify(row, null, 2));
                    return [2 /*return*/, 0];
                case 3:
                    match = arg.match(/^--fb-content=(.*)$/);
                    if (match) {
                        content = match[1];
                        return [3 /*break*/, 4];
                    }
                    match = arg.match(/^--fb-page-id=(.*)$/);
                    if (match) {
                        pageId = match[1];
                        return [3 /*break*/, 4];
                    }
                    match = arg.match(/^--fb-locality-id=(.*)$/);
                    if (match) {
                        argsLocalityID = match[1];
                        return [3 /*break*/, 4];
                    }
                    if (arg.match(/^--fb-locality-expired/)) {
                        mode = 'check-locality-expired';
                        return [3 /*break*/, 4];
                    }
                    if (arg.match(/^--fb-gen-app-token/)) {
                        mode = 'generate-app-token';
                        return [3 /*break*/, 4];
                    }
                    if (arg.match(/^--fb-gen-page-token/)) {
                        mode = 'generate-page-token';
                        return [3 /*break*/, 4];
                    }
                    match = arg.match(/^--fb-user-id=(.*)$/);
                    if (match) {
                        userId = match[1];
                        return [3 /*break*/, 4];
                    }
                    match = arg.match(/^--fb-access-token=(.*)$/);
                    if (match) {
                        accessToken = match[1];
                        return [3 /*break*/, 4];
                    }
                    match = arg.match(/^--fb-locality=(.*)$/);
                    if (match) {
                        locality = match[1];
                        return [3 /*break*/, 4];
                    }
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    if (!(mode === 'generate-page-token' && userId && accessToken)) return [3 /*break*/, 7];
                    userId = userId.replace(/[^0-9a-z_-]+/gi, '');
                    accessToken = accessToken.replace(/[^a-z.0-9_\-+]+/gi, '');
                    if (verbose) {
                        console.log('generate page token');
                    }
                    url = "https://graph.facebook.com/".concat(userId, "/accounts?access_token=").concat(accessToken);
                    if (verbose) {
                        console.debug({ url: url });
                    }
                    return [4 /*yield*/, fetch(url)
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!verbose) return [3 /*break*/, 2];
                                        console.log(res.status);
                                        _b = (_a = console).log;
                                        _c = ['json'];
                                        return [4 /*yield*/, res.json()];
                                    case 1:
                                        _b.apply(_a, _c.concat([_d.sent()]));
                                        _d.label = 2;
                                    case 2: return [4 /*yield*/, res.json()];
                                    case 3: return [2 /*return*/, _d.sent()];
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
                case 6:
                    r = _c.sent();
                    console.log(JSON.stringify(r.data, null, 2));
                    return [2 /*return*/, 0];
                case 7:
                    if (!(mode === 'check-locality-expired')) return [3 /*break*/, 9];
                    lib = new facebook_1.Facebook();
                    int_locality_id = parseInt(locality, 10);
                    if (isNaN(int_locality_id)) {
                        console.error("Invalid locality id. must be a valid integer. Exiting...");
                        return [2 /*return*/, -1];
                    }
                    return [4 /*yield*/, lib.is_locality_expired(int_locality_id)];
                case 8:
                    is_expired = _c.sent();
                    console.log("Locality ".concat(locality, " ").concat(is_expired ? 'IS' : '_is NOT_', " expired"));
                    return [2 /*return*/, 0];
                case 9:
                    if (!(mode === 'post')) return [3 /*break*/, 12];
                    lib = new facebook_1.Facebook();
                    return [4 /*yield*/, models.Incident.findAll({
                            where: {
                                locality: parseInt(argsLocalityID, 10),
                            },
                            raw: true,
                        })];
                case 10:
                    incident = _c.sent();
                    if (incident.length === 0) {
                        console.error("couldnt find incidents with that locality id of:\"".concat(argsLocalityID, "\""));
                        return [2 /*return*/, -1];
                    }
                    return [4 /*yield*/, lib.post_to_page(pageId, incident[0])];
                case 11:
                    r = _c.sent();
                    for (_a = 0, r_1 = r; _a < r_1.length; _a++) {
                        line = r_1[_a];
                        console.log(r[0], r[1]);
                    }
                    return [2 /*return*/, 0];
                case 12:
                    if (!(mode === 'dump-available')) return [3 /*break*/, 14];
                    lib = new facebook_1.Facebook();
                    localityId = parseInt(argsLocalityID, 10);
                    return [4 /*yield*/, lib.available_and_active_pages(localityId)];
                case 13:
                    r = _c.sent();
                    for (_b = 0, r_2 = r; _b < r_2.length; _b++) {
                        row = r_2[_b];
                        console.log(row);
                        console.log('----------------------------------------------------------');
                    }
                    return [2 /*return*/, 0];
                case 14: return [2 /*return*/, 0];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var args, n, _i, _a, func;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                args = process.argv.splice(2);
                n = 0;
                _i = 0, _a = [
                    handle_one_signal,
                    handle_twitter_post,
                    handle_facebook,
                    handle_user,
                ];
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                func = _a[_i];
                return [4 /*yield*/, func(args)];
            case 2:
                n = _b.sent();
                if (n < 0) {
                    return [2 /*return*/, process.exit(1)];
                }
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=cli.js.map