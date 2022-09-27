import { Express, Request, Response } from "express";
import { loginHandler, logout, refreshHandler } from "./controller/auth.controller";
import { createUserHandler } from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import { loginSchema } from "./schema/login.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post("/api/login", validateResource(loginSchema), loginHandler);

  app.get("/api/refresh", refreshHandler);

  app.post('/api/logout', logout)
    

  // app.get("/api/sessions", requireUser, getUserSessionsHandler);

  // app.delete("/api/sessions", requireUser, deleteUserSessionHandler);
}

export default routes;
