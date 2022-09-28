import { object, string } from "zod";

export const loginSchema = object({
  body: object({
    password: string({ required_error: "Password is required" }),

    email: string({ required_error: "Email is required" }),
  }),
});
