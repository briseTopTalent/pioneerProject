'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const models = require('../../models');
const sequelize = models.sequelize;
import { dd } from '../../../utils';
const { refreshUser } = require('../../../database/redis');

const adminRoles = ['super', 'admin'];

class TokenGenerator {
  secretOrPrivateKey: string;
  secretOrPublicKey: string;
  options: any;
  constructor(
    secretOrPrivateKey: string,
    secretOrPublicKey: string,
    options: any
  ) {
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
  }
  sign(payload: any, signOptions: any) {
    const jwtSignOptions = Object.assign({}, signOptions, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  // refreshOptions.verify = options you would use with verify function
  // refreshOptions.jwtid = contains the id for the new token
  refresh(token: string, refreshOptions: any) {
    const payload = jwt.verify(
      token,
      this.secretOrPrivateKey,
      //this.secretOrPublicKey,
      refreshOptions.verify
    );
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
    const jwtSignOptions = Object.assign({}, this.options, {
      jwtid: refreshOptions.jwtid,
    });
    // The first signing converted all needed options into claims, they are already in the payload
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }
}

const getTokenGenerator = () => {
  const options = {
    algorithm: 'HS256',
    keyid: '1',
    noTimestamp: false,
    //expiresIn: `${60 * 24}m`,
    //notBefore: '2s',
  };
  return new TokenGenerator(config.JWT_SECRET, '', options);
};
const sign = (payload: any, options: any) => {
  let tokenGenerator = getTokenGenerator();
  return tokenGenerator.sign(payload, options);
};

export const refresh = async (token: string) => {
  let tokenGenerator = getTokenGenerator();
  return tokenGenerator.refresh(token, {
    verify: { audience: 'firewire', issuer: 'firewirebackend' },
    jwtid: '2',
  });
};
export const getToken = async (user: ION.User): Promise<ION.Token> => {
  const token = sign({ id: user.id, email: user.email, role: user.role }, {
    issuer: 'firewirebackend',
  });
  const refreshToken = sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    {
      audience: 'firewire',
      issuer: 'firewirebackend',
      jwtid: '2',
    }
  );
  let role: 'super' | 'admin' | 'basic_user' = 'basic_user';
  if (user.role === 'super' || user.role === 'admin') {
    role = user.role;
  }
  await refreshUser(user.id);
  const data: ION.Token = {
    verified: user.verified,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role,
    isAdmin: adminRoles.includes(user.role) || false,
    token,
    refreshToken,
    token_type: 'jwt',
    expiresIn: 0,
  };
  return data;
};
