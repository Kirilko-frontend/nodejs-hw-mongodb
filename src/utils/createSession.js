import crypto from 'node:crypto';
import { Session } from '../models/session.js';

export async function createSession(userId) {
  await Session.deleteOne({ userId });

  return Session.create({
    userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 1000),
  });
}
