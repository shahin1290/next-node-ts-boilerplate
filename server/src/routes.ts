import { Express, Request, Response } from "express";
import {
  loginHandler,
  logoutAllHandler,
  logoutHandler,
  refreshHandler,
} from "./controller/auth.controller";
import {
  createUserHandler,
  currentUserHandler,
} from "./controller/user.controller";
import { requireUser } from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { loginSchema } from "./schema/login.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/users", validateResource(createUserSchema), createUserHandler);
  app.get("/me", requireUser, currentUserHandler);

  app.post("/login", validateResource(loginSchema), loginHandler);

  app.post("/refresh", refreshHandler);

  app.post("/logout", requireUser, logoutHandler);
  app.post("/logout-all", requireUser, logoutAllHandler);
}

export default routes;
