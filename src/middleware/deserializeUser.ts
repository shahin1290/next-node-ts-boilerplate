import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { Cookies } from "../../shared";
import { verifyRefreshToken } from "../utils/jwt.utils";

const deserializeUser = (req: Request, res: Response, next: NextFunction) => {
  //if access token is verified, then set locals
  const accessToken = (
    req.headers.authorization ||
    req.cookies[Cookies.RefreshToken] ||
    ""
  ).replace(/^Bearer\s/, "");


  if (!accessToken) {
    return next();
  }

  const decoded = verifyRefreshToken(accessToken);

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
};

export default deserializeUser;
