'use strict';

const base64 = require('./base64');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
module.exports = function (str) {
  return base64.encode(
    bcrypt.hashSync(
      [
        crypto.randomBytes(32).toString(),
        JSON.stringify(str),
        crypto.randomBytes(32).toString(),
        Date.now(),
      ].join(crypto.randomBytes(32))
    )
  );
};
