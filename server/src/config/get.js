const path = require('path');
module.exports = {
  fetch: () => {
    if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
      const file = path.join(__dirname, '/../../../.env.test');
      return require('dotenv').config({
        path: file,
      });
    }
    if (process.env.PIONEER_ENV_FILE) {
      return require('dotenv').config({ path: process.env.PIONEER_ENV_FILE });
    } else {
      return require('dotenv').config();
    }
  },
};
