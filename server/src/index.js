const app = require('./app');
const next = require('next');
const Logger = require('./utils/logger');

const { PORT, NODE_ENV } = require('./config');

const dev = process.env.NODE_ENV !== 'production';
const webapp = next({ dev });
const handle = webapp.getRequestHandler();
const redis = require('redis');
let server;

(async () => {
    global.redisClient = redis.createClient();

    global.redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await global.redisClient.connect();
  await webapp.prepare();
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  server = app.listen(PORT, function () {
    Logger.info(`app running on ${PORT}`);
  });

  process.on('uncaughtException', err => {
    Logger.warn('Uncaught Exception');
    Logger.error(err.stack);
    //process.exit(1);
  });

  process.on('unhandledRejection', err => {
    Logger.warn('Unhandled Rejection!!' + err);
    // process.exit(1);
  });
})();
module.exports = server;
