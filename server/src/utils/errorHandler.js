const Logger = require('./logger');
const utils = require('./');
const { isCelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => {
  console.log(err);
  Logger.error(err.stack);
  Logger.error(`${err.name}: ${err.message}`);

  if (err.isOperational) {
    utils.jsonFailed(res, {}, err.message, err.code, err);
  } else if (err.name === 'ValidationError') {
    utils.jsonFailed(res, {}, err.message, 406, err);
  } else if (err.name === 'JsonWebTokenError') {
    utils.jsonFailed(res, {}, err.message, 409, err);
  } else if (err.name === 'TokenExpiredError') {
    utils.jsonFailed(res, {}, err.message, 401, err);
    // } else if (err.name === "SequelizeDatabaseError") {
    //   utils.jsonFailed(res, {}, err.message, 409, err);
  } else if (err instanceof SyntaxError) {
    return jsonFailed(res, {}, err.message, 409, err);
  } else if (isCelebrateError(err)) {
    const messages = err.details;
    let jsonObject = {};
    messages.forEach((value, key) => {
      jsonObject[key] = value;
    });
    let msg = jsonObject.body.details.map(er => {
      return { [er.path]: er.message.replace(/["]+/g, '') };
    });
    const message = jsonObject.body.details
      ? jsonObject.body.details[0].message.replace(/["]+/g, '')
      : err.message;
    // Logger.info("error--->", message, msg)
    return utils.jsonFailed(res, msg, message, 400, msg);
  } else {
    utils.jsonFailed(res, {}, 'Something went wrong in the server', 500, err);
  }
  return;
};

module.exports = errorHandler;
