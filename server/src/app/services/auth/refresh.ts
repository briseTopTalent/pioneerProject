const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const url = require('url');
const models = require('../../models');
const { dd } = require('../../../utils');
const config = require('../../../config');
const sequelize = models.sequelize;
const tokenizer = require('../../../utils/tokenizer');
const LoginAdmin = require('../../services/auth/login');
const UserService = require('../../services/user');

const adminRoles = ['super', 'admin'];
import { refresh as _refresh } from './token';

export async function refresh(
  token: string
): Promise<{ message: string; error: boolean; data: string | null }> {
  try {
    return {
      error: false,
      message: 'ok',
      data: await _refresh(token),
    };
  } catch (err) {
    let message: string = `Couldn't refresh token`;
    if(err instanceof Error){
      message = err.message;
    }
    if(typeof err === 'string'){
      message = err
    }

    return {
      error: true,
      message,
      data: null,
    };
  }
}
