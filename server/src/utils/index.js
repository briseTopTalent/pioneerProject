"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Utils = {};
function json_send(res, data, message, status, status_code, meta) {
    data = data || null;
    message = message || '';
    status = status || 'success';
    var d = {
        status: status,
        message: message,
        data: data,
    };
    res.statusCode = status_code;
    if (process.env.ENVIRONMENT !== 'test') {
        // Logger(res, {meta, message, data});
    }
    return res.status(status_code).json(d);
}
Utils.jsonS = function (express_res, data, message, status_code, meta) {
    if (status_code === void 0) { status_code = 200; }
    return json_send(express_res, data, message, 'success', status_code, meta);
};
Utils.json401 = function (express_res, data, message, error) {
    if (error === void 0) { error = {}; }
    return json_send(express_res, data, message, 'error', 401, error);
};
Utils.jsonFailed = function (express_res, data, message, status_code, meta) {
    if (status_code === void 0) { status_code = 400; }
    return json_send(express_res, data, message, 'error', status_code, meta);
};
Utils.InternalRes = function (error, message, data) {
    return { error: error, message: message, data: data };
};
Utils.dd = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.debug(JSON.stringify(__spreadArray([], args, true), null, 2));
};
module.exports = Utils;
//# sourceMappingURL=index.js.map