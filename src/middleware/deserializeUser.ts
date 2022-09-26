import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //if access token is verified, then set locals
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  console.log("accessToken", accessToken);
  

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  //if access token not verified but refresh token is verified,
  //then reissue access token and set also locals
  const refreshToken = get(req, "headers.x-refresh");

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    const { decoded } = verifyJwt(accessToken);

    res.locals.user = decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
