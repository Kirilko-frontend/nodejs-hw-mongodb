import express from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  requestRessetPasswordController,
  ressetPasswordController,
  getOauthController,
  confirmOauthController,
} from '../controllers/authController.js';
import {
  registerSchema,
  loginSchema,
  requestRessetPasswordSchema,
  ressetPasswordSchema,
  confirmOauthSchema,
} from '../validation/auth.js';

const authRoute = express.Router();

authRoute.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

authRoute.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

authRoute.post('/logout', ctrlWrapper(logoutController));

authRoute.post('/refresh', ctrlWrapper(refreshController));

authRoute.post(
  '/send-reset-email',
  validateBody(requestRessetPasswordSchema),
  ctrlWrapper(requestRessetPasswordController),
);

authRoute.post(
  '/reset-pwd',
  validateBody(ressetPasswordSchema),
  ctrlWrapper(ressetPasswordController),
);

authRoute.get('/get-oauth-url', ctrlWrapper(getOauthController));

authRoute.post(
  '/confirm-oauth',
  validateBody(confirmOauthSchema),
  ctrlWrapper(confirmOauthController),
);

export default authRoute;
