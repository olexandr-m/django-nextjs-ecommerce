import { Input, PasswordInput, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import React from "react";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import styles from "./form-field.module.css";

type FormFieldProps<TFieldValues extends FieldValues> = {
  label?: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
  isTextArea?: boolean;
  link?: {
    linkText: string;
    linkUrl: string;
  };
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export function FormField<TFieldValues extends FieldValues>({
  label,
  name,
  register,
  disabled = false,
  errors,
  type = "text",
  placeholder,
  autoComplete = "off",
  startIcon,
  endIcon,
  link,
  className,
  isPassword = false,
  isTextArea = false,
}: FormFieldProps<TFieldValues>) {
  const errorMessage = errors[name]?.message as string | undefined;

  const renderInputComponent = () => {
    const props = {
      id: name,
      ...register(name),
      placeholder,
      disabled,
      autoComplete,
      className: cn(className, isPassword && styles.passwordPadding),
    };

    if (isTextArea) return <Textarea {...props} />;
    if (isPassword) return <PasswordInput {...props} />;

    return <Input {...props} endIcon={endIcon} startIcon={startIcon} type={type} />;
  };

  return (
    <div className={styles.wrapper} data-testid="form-field-wrapper">
      <div className={styles.header}>
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
        {link && (
          <Link className={styles.link} href={link.linkUrl}>
            {link.linkText}
          </Link>
        )}
      </div>
      <div className={styles.inputContainer}>{renderInputComponent()}</div>
      {errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </div>
  );
}
