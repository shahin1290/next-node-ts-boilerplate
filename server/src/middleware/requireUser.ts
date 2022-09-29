import { NextFunction, Request, Response } from "express";
import { Cookies } from "../shared";
import { verifyAccessToken } from "../utils/jwt.utils";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = verifyAccessToken(req.cookies[Cookies.AccessToken]);

  if (!token) {
    res.status(401);
    return next(new Error("Not Signed in"));
  }

  res.locals.token = token;

  next();
}
