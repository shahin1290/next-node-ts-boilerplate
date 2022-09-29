import { Request, Response } from "express";
import { Cookies } from "../shared";
import { config } from "../../config";
import {
  findUser,
  increaseTokenVersion,
  validateEmailAndPassword,
} from "../service/user.service";
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

    const { accessToken } = refreshTokens(current, user.tokenVersion);

    console.log({ accessToken });

    setTokens(res, accessToken);
  } catch (error) {
    clearTokens(res);
  }

  res.end();
}

export const logoutHandler = (req: Request, res: Response) => {
  clearTokens(res);
  res.end();
};

export const logoutAllHandler = async (req: Request, res: Response) => {
  await increaseTokenVersion(res.locals.token.userId);

  clearTokens(res);
  res.end();
};
