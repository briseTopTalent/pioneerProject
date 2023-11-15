const express = require('express');
var path = require('path');
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const morganMiddleware = require('./utils/morgan');
const errorHandler = require('./utils/errorHandler');
const apiRoute = require('./routes');
const { jsonS } = require('./utils');
const {
  QueueWorker,
} = require('./app/services/push-notifications/queue-worker');

const app = express();

app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morganMiddleware);
// adding Helmet to enhance your API's security
// app.use(helmet());
app.use(cors());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRoute);

// app.get("/", (req, res) => {
//   return jsonS(res, {},`Online by ${Date()} on ${req.app.get("env")} Environment `);
// });

// app.use("**", (req, res, next) => {
//   let err = {};
//   err.message = `${req.ip} tried to reach a resource at ${req.originalUrl} that is not on this server.`;
//   err.code = 404;
//   err.isOperational = true;
//   next(err);
// });

app.use(errorHandler);
const worker = new QueueWorker();
setInterval(async () => {
  try {
    let response = await worker.work(250);
    if(response.error || response.sent > 0){
      console.log(`Worker response: ` + JSON.stringify(response, null, 2));
    }
  } catch (e) {
    console.error(
      `QueueWorker.work() failed with: ` + JSON.stringify(e, null, 2)
    );
  }
}, 10000);

module.exports = app;
