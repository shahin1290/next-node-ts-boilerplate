import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { createUser, findUser } from "../service/user.service";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error: any) {
    console.error(error);
    return res.status(409).send(error.message);
  }
}
export async function currentUserHandler(req: Request, res: Response) {
  const user = await findUser({ _id: res.locals.token.userId });
  res.json(user);
}
