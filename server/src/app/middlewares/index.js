const jwt = require('jsonwebtoken');
const config = require('../../config');
const Utils = require('../../utils');
const { getRedisData } = require('../../database/redis');
const errMsg = 'Access Denied, No token provided.';
const models = require('../models');
const { dd } = Utils;

const auth = async (req, res, next) => {
  var tok = req.headers.authorization || req.header.Authorization;
  if (!tok) return Utils.json401(res, {}, errMsg, errMsg);
  else {
    token = tok.split(' ')[1];
  }
  if (!token) return Utils.json401(res, {}, errMsg, errMsg);

  try {
    const decoded = await jwt.verify(token, config.JWT_SECRET);
    let user = await getRedisData(
      ['user', decoded.id],
      async () => {
        return await models.User.findOne({
          where: {
            id: decoded.id,
          },
          raw: true,
        });
      }
    );

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        iat: Date.now(),
        exp: Date.now() * 10,
        is_admin: ['super', 'admin'].includes(user.role),
      };
      next();
      return;
    }
  } catch (err) {
    return Utils.json401(res, {}, 'invalid token', 'invalid token');
  }

  return Utils.json401(res, {}, 'invalid token', 'invalid token');
};

module.exports = auth;
