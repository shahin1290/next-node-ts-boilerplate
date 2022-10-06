import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import {
  AccessToken,
  AccessTokenPayload,
  Cookies,
  RefreshToken,
  RefreshTokenPayload,
} from "../shared";
import { config } from "../config";

enum TokenExpiration {
  Access = 5 * 60,
  Refresh = 7 * 24 * 60 * 60,
  RefreshIfLessThan = 4 * 24 * 60 * 60,
}

function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: TokenExpiration.Access,
  });
}

function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: TokenExpiration.Refresh,
  });
}

export function buildTokens(userId: string, version: number) {
  const accessPayload: AccessTokenPayload = { userId };
  const refreshPayload: RefreshTokenPayload = {
    userId,
    version,
  };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.refreshTokenSecret) as RefreshToken;
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, config.accessTokenSecret) as AccessToken;
  } catch (e) {}
}

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  // secure: true,
  sameSite: true,
  // domain: config.baseDomain,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
};

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
};

export function setTokens(res: Response, access: string, refresh?: string) {
  res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
  if (refresh)
    res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions);
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
  if (tokenVersion !== current.version) throw "Token revoked";

  const accessPayload: AccessTokenPayload = { userId: current.userId };

  let refreshPayload: RefreshTokenPayload | undefined;

  // const expiration = new Date(current.exp * 1000);
  // const now = new Date();
  // const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000;

  // if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
  //   refreshPayload = { userId: current.userId, version: tokenVersion };
  // }

  const accessToken = signAccessToken(accessPayload);

  return { accessToken };
}

export function clearTokens(res: Response) {
  res.cookie(Cookies.AccessToken, "", { ...defaultCookieOptions, maxAge: 0 });
  res.cookie(Cookies.RefreshToken, "", { ...defaultCookieOptions, maxAge: 0 });
}
