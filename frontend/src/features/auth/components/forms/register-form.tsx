"use client";

import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui";
import { useRegister } from "../../hooks";
import { cn } from "@/lib/utils/cn";
import { registerSchema, TRegisterSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import styles from "./auth-form.module.css";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tValidation = useTranslations("validation");
  const schema = registerSchema(tValidation);
  const { handleRegister, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmed_password: "",
    },
  });

  const onSubmit = (values: TRegisterSchema) => handleRegister(values, setError, reset);

  return (
    <main>
      <form className={styles.authForm} noValidate role="form" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          autoComplete="username"
          errors={errors}
          name="username"
          placeholder={t("username")}
          register={register}
        />

        <FormField
          autoComplete="email"
          errors={errors}
          name="email"
          placeholder={t("email")}
          register={register}
        />

        <FormField
          autoComplete="new-password"
          errors={errors}
          isPassword={true}
          name="password"
          placeholder={t("password")}
          register={register}
        />

        <FormField
          autoComplete="new-password"
          errors={errors}
          isPassword={true}
          name="confirmed_password"
          placeholder={t("confirmed_password")}
          register={register}
        />

        <Button className={cn("btn--primary style2", styles.authButton)} loading={isLoading} type="submit">
          {t("button")}
        </Button>
      </form>
    </main>
  );
}
