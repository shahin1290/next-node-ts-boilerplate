import jwt from "jsonwebtoken";
import config from "config";
import { RefreshToken, TokenPayload } from "../../shared";

enum TokenExpiration {
  Access = 5 * 60,
  Refresh = 7 * 24 * 60 * 60,
  RefreshIfLessThan = 4 * 24 * 60 * 60,
}

const accessTokenSecret = config.get<string>("accessTokenSecret");
const refreshTokenSecret = config.get<string>("refreshTokenSecret");

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: TokenExpiration.Access,
  });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: TokenExpiration.Refresh,
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshTokenSecret) as RefreshToken;
}
