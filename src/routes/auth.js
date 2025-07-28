import express from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validation/auth.js';

const authRoute = express.Router();

authRoute.post(
  '/auth/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

authRoute.post(
  '/auth/login',
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

authRoute.post('/auth/logout', ctrlWrapper(logoutController));

authRoute.post('/auth/refresh', ctrlWrapper(refreshController));

export default authRoute;
