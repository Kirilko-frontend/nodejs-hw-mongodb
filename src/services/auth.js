import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import path from 'node:path';
import * as fs from 'node:fs';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';

import { getEnvVariable } from '../utils/getEnvVariable.js';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession } from '../utils/createSession.js';
import { sendMail } from '../utils/sendMail.js';

const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/request-password-reset.hbs'),
  { encoding: 'utf-8' },
);

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }

  return createSession(user._id);
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return createSession(session.userId);
}

export async function requestRessetPassword(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVariable('SECRET_JWT'),
    { expiresIn: '15m' },
  );

  const template = Handlebars.compile(REQUEST_PASSWORD_RESET_TEMPLATE);

  const link = `${getEnvVariable('LOCAL_LINK')}?token=${token}`;

  try {
    await sendMail({
      to: email,
      subject: 'Resset password',
      html: template({ resetPasswordLink: link }),
    });
    return { success: true, message: 'Reset email sent' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

export async function ressetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVariable('SECRET_JWT'));

    const user = await User.findById(decoded.sub);

    if (user === null) {
      throw new createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    console.log(error);
  }
}

export async function loginOrRegister(email, name) {
  let user = await User.findOne({ email });

  if (user === null) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10,
    );
    user = await User.create({
      name,
      email,
      password,
    });
  }
  await Session.deleteOne({ userId: user._id });

  return createSession(user._id);
}
