'use strict';

const glob = require('glob');

let service = {};
glob
  .sync('*.js', {
    cwd: __dirname,
    ignore: 'index.js',
  })
  .forEach(file => {
    const fileData = require(`./${file}`);
    service[fileData.title] = fileData.module;
  });
module.exports = service;
