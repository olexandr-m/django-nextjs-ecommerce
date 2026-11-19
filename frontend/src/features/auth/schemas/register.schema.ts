import { requiredString } from "@/lib/validations/rules";
import * as z from "zod";

export const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;

export const registerSchema = (t: (key: string) => string) =>
  z
    .object({
      username: requiredString(t, "username")
        .regex(/^[a-zA-Z0-9]+$/, { message: t("username.invalid") })
        .min(3, { message: t("username.min") }),

      email: requiredString(t, "email").pipe(z.email({ message: t("email.invalid") })),
      password: requiredString(t, "password").min(8, { message: t("password.min") }),
      confirmed_password: requiredString(t, "confirmed_password").min(8, {
        message: t("confirmed_password.min"),
      }),
    })
    .refine((data) => data.password === data.confirmed_password, {
      message: t("password.mismatch"),
      path: ["confirmed_password"],
    })
    .strict();

export type TRegisterSchema = z.infer<ReturnType<typeof registerSchema>>;
