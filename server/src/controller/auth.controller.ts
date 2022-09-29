import { Request, Response } from "express";
import { Cookies } from "../shared";
import { config } from "../../config";
import { findUser, validateEmailAndPassword } from "../service/user.service";
import {
  buildTokens,
  clearTokens,
  refreshTokens,
  setTokens,
  verifyRefreshToken,
} from "../utils/jwt.utils";

export async function loginHandler(req: Request, res: Response) {
  //Validate user email and password
  const user = await validateEmailAndPassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  //buld access & refresh tokens
  const { accessToken, refreshToken } = buildTokens(
    user._id,
    user.tokenVersion
  );

  //set the tokens as cookie
  setTokens(res, accessToken, refreshToken);

  //redirect
  res.send({ accessToken, refreshToken });
}

export async function refreshHandler(req: Request, res: Response) {
  try {
    const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken]);
    const user = await findUser({ _id: current.userId });
    if (!user) throw "User not found";

    const { accessToken, refreshToken } = refreshTokens(
      current,
      user.tokenVersion
    );
    setTokens(res, accessToken, refreshToken);
  } catch (error) {
    clearTokens(res);
  }
}

export const logout = (req: Request, res: Response) => {
  clearTokens(res);
  res.end();
};
