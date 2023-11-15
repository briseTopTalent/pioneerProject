const { Joi } = require('celebrate');

const googleOAuthSchema = {
  body: Joi.object().keys({
    id: Joi.string(),
  }),
};
const resetPasswordSchema = {
  body: Joi.object().keys({
    resetHash: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
};
const subscribeToLocality = {
  body: Joi.object().keys({
    locality: Joi.string().required(),
    sub_locality: Joi.string().required(),
  }),
};
const unsubscribeToLocality = {
  body: Joi.object().keys({
    locality: Joi.string().required(),
    sub_locality: Joi.string().required(),
  }),
};
const forgotPasswordSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4),
  }),
};
const googleSchema = {
  body: Joi.object().keys({
    idtoken: Joi.string().required(),
  }),
};
const createAdminSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required(),
    password: Joi.string().min(8),
  }),
};
const registerUserSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    title: Joi.string().required(),
    password: Joi.string().min(8),
  }),
};

const updateAdminSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    // role: Joi.string().required()
  }),
};
const ssoSchema = {
  body: Joi.object().keys({
    idtoken: Joi.string(),
  }),
};
const refreshTokenSchema = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
const updateUserSchema = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    title: Joi.string(),
  }),
};
const nullSchema = {
  body: Joi.object().keys({
    ignored: Joi.string(),
  }),
};

const fbLoginSchema = {
  body: Joi.object().keys({
    userID: Joi.string().required(),
    expiresIn: Joi.number(),
    accessToken: Joi.string().required(),
    data_access_expiration_time: Joi.number(),
    signedRequest: Joi.string(),
    graphDomain: Joi.string(),
    fwLocalityID: Joi.number().required(),
  }),
};
const sendResetEmailSchema = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};
const appleVerifyTokenSchema = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    email: Joi.string().email().allow(''),
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
  }),
};


module.exports = {
  nullSchema,
  ssoSchema,
  loginSchema,
  createAdminSchema,
  updateAdminSchema,
  registerUserSchema,
  subscribeToLocality,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleOAuthSchema,
  updateUserSchema,
  unsubscribeToLocality,
  refreshTokenSchema,
  fbLoginSchema,
  sendResetEmailSchema,
  appleVerifyTokenSchema,
};
