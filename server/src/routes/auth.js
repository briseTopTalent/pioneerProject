'use strict';
const router = require('express').Router();
const { celebrate } = require('celebrate');
const AuthController = require('../app/controllers/authController');
const UserController = require('../app/controllers/userController');
const controllerWrapper = require('../app/controllers');
const {
  googleOauthSchema,
  loginSchema,
  googleOAuthSchema,
  createAdminSchema,
  registerUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  ssoSchema,
  refreshTokenSchema,
  nullSchema,
  fbLoginSchema,
  sendResetEmailSchema,
  appleVerifyTokenSchema,
} = require('../app/requests/auth');

router.post(
  '/refresh',
  celebrate(refreshTokenSchema),
  controllerWrapper(AuthController.refreshToken)
);
router.post(
  '/login',
  celebrate(loginSchema),
  controllerWrapper(AuthController.login)
);
router.get(
  '/google/sso/url',
  celebrate(googleOAuthSchema),
  controllerWrapper(AuthController.googleOAuth)
);
router.get('/sso', celebrate(ssoSchema), controllerWrapper(AuthController.sso));
router.get(
  '/sso/tokens',
  celebrate(googleOAuthSchema),
  controllerWrapper(AuthController.loginSso)
);
router.post(
  '/register',
  celebrate(registerUserSchema),
  controllerWrapper(UserController.CreateNonAdminUser)
);
router.post(
  '/create-admin',
  celebrate(createAdminSchema),
  controllerWrapper(AuthController.createNewAdmin)
);
router.post(
  '/forgot-password',
  celebrate(forgotPasswordSchema),
  controllerWrapper(UserController.ForgotPassword)
);

router.post(
  '/reset-password',
  celebrate(resetPasswordSchema),
  controllerWrapper(UserController.ResetPassword)
);
router.get(
  '/fb/app-id',
  celebrate(nullSchema),
  controllerWrapper(AuthController.facebookAppId)
);
router.post(
  '/apple/verify',
  celebrate(appleVerifyTokenSchema),
  controllerWrapper(AuthController.verifyApple)
);

module.exports = {
  baseUrl: '/auth',
  router,
  auth: false,
};
