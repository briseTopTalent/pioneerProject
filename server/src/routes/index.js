'use strict';

const glob = require('glob');
const express = require('express');
const auth = require('../app/middlewares');

const router = express.Router();
glob
  .sync('*.js', {
    cwd: __dirname,
    ignore: 'index.js',
  })
  .forEach(file => {
    //
    const fileRoutes = require(`./${file}`);
    if (fileRoutes.auth)
      router.use(fileRoutes.baseUrl, auth, fileRoutes.router);
    else router.use(fileRoutes.baseUrl, fileRoutes.router);
  });
router.use('**', (req, res, next) => {
  let err = {};
  err.message = `${req.ip} tried to reach a resource at ${req.originalUrl} that is not on this server.`;
  err.code = 404;
  err.isOperational = true;
  next(err);
});

module.exports = router;
