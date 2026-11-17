"use client";

import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import styles from "./Button.module.css";

const VARIANTS = {
  variant: {
    default: styles.primary,
    destructive: styles.destructive,
    outline: styles.outline,
    secondary: styles.secondary,
    ghost: styles.ghost,
    link: styles.link,
  },
  size: {
    default: styles.default,
    sm: styles.sm,
    lg: styles.lg,
    icon: styles.icon,
  },
} as const;

const buttonVariants = cva(styles.base, {
  variants: VARIANTS,
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type RootButtonProps = React.ComponentPropsWithRef<"button">;

export interface ButtonProps extends Omit<RootButtonProps, "size">, VariantProps<typeof buttonVariants> {
  title?: string;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, title, loading = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), loading && styles.loading, className)}
        aria-busy={loading || undefined}
        disabled={loading || props.disabled}
        ref={ref}
        role="button"
        {...props}
      >
        <span className={styles.content}>
          {loading && (
            <span className={styles.spinner}>
              <Spinner size="xs" />
            </span>
          )}
          <span className={styles.label}>{children ?? title}</span>
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
