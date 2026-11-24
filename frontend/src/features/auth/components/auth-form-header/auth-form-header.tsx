import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import React from "react";
import styles from "./auth-form-header.module.css";

type FormHeaderProps = {
  title?: string;
  staticText?: string;
  linkText?: string;
  linkHref?: string;
  children?: React.ReactNode;
};

export function AuthFormHeader({ title, staticText, linkHref, linkText, children }: FormHeaderProps) {
  return (
    <div
      className={cn("col-xl-6 col-lg-8 col-md-9 wow fadeInUp animated", styles.container)}
      data-testid="auth-form-header"
    >
      <div className={cn("login-register-form", styles.formCard)}>
        <div className={cn("top-title text-center", styles.topTitle)}>
          <h2 className={cn("text-3xl font-extrabold", styles.title)}>{title}</h2>

          {(staticText || linkText) && linkHref && (
            <p className={styles.subtitle}>
              {staticText && <span>{staticText}</span>}
              {linkText && (
                <Link className={styles.link} href={linkHref}>
                  {linkText}
                </Link>
              )}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
