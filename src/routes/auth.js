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

export default authRoute;
