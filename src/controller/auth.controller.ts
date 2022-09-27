import { Request, Response } from "express";
import { Cookies } from "../../shared";
import { findUser, validateEmailAndPassword } from "../service/user.service";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils";

export async function loginHandler(req: Request, res: Response) {
  //Validate user email and password
  const user = await validateEmailAndPassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  //Create a accessToken
  const accessToken = signAccessToken({
    userId: user._id,
    name: user.name,
    email: user.email,
  });

  //Create a refreshToken
  const refreshToken = signRefreshToken({
    userId: user._id,
    name: user.name,
    email: user.email,
  });

  //set as cookie
  res.cookie(Cookies.RefreshToken, refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  //Return access and refresh tokens
  return res.send({ accessToken });
}

export async function refreshHandler(req: Request, res: Response) {
  const decoded = verifyRefreshToken(req.cookies[Cookies.RefreshToken]);
  const user = await findUser({ _id: decoded.userId });
  if (!user) throw "User not found";

  //Create a accessToken
  const accessToken = signAccessToken({
    userId: user._id,
    name: user.name,
    email: user.email,
  });

  return res.send({ accessToken });
}

// export async function getUserSessionsHandler(req: Request, res: Response) {
//   const userId = res.locals.user._id;

//   const sessions = await findSessions({ user: userId, valid: true });

//   return res.send(sessions);
// }

// export async function deleteUserSessionHandler(req: Request, res: Response) {
//   const sessionId = res.locals.user.session;

//   await updateSession({ _id: sessionId }, { valid: false });

//   return res.send({
//     accessToken: null,
//     refreshToken: null,
//   });
// }

export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!req.cookies[Cookies.RefreshToken]) return res.sendStatus(204); //No content
  res.clearCookie(Cookies.RefreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
};
