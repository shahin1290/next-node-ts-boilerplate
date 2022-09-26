import config from "config";
import { Request, Response } from "express";
import { createSession } from "../service/session.service";
import { validateEmailAndPassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  //Validate user email and password
  const user = await validateEmailAndPassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  //Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  //Create a accessToken
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTl") }
  );

  //Create a refreshToken
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenTl") }
  );

  //Return access and refresh tokens
  return res.send({ accessToken, refreshToken });
}
