import { z } from "zod";

export const requiredString = (t: (key: string) => string, key: string) =>
  z
    .string({
      error: (issue) =>
        issue.code === "invalid_type" ? { message: t(`${key}.invalid`) } : { message: t(`${key}.required`) },
    })
    .trim()
    .min(1, { message: t(`${key}.required`) });
