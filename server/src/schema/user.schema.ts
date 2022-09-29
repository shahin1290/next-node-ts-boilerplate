import { number, object, string, TypeOf } from "zod";
export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    tokenVersion: number(),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be 6 chars minimum"
    ),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
