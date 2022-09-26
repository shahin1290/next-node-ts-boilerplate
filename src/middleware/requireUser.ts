import { NextFunction, Request, Response } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  console.log("user", user);

  if (!user) {
    return res.sendStatus(403);
  }

  next();
};

export default requireUser;
