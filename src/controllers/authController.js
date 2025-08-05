import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestRessetPassword,
  ressetPassword,
} from '../services/auth.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json({
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { sessionId } = req.cookies;

  if (typeof sessionId !== 'undefined') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    message: 'Session refreshed',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestRessetPasswordController(req, res) {
  await requestRessetPassword(req.body.email);
  res.json({
    status: 200,
    message: 'Message send successfuly',
  });
}

export async function ressetPasswordController(req, res) {
  const { token, password } = req.body;
  await ressetPassword(token, password);
  res.json({
    status: 200,
    message: 'Password successfuly changed',
  });
}
