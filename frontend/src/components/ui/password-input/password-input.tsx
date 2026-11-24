"use client";

import { Input } from "@/components/ui/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import * as React from "react";
import { useState } from "react";
import styles from "./password-input.module.css";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        className={className}
        type={showPassword ? "text" : "password"}
        {...props}
        endIcon={
          <button
            className={styles.toggleButton}
            aria-label={showPassword ? "Hide password" : "Show password"}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon className={styles.icon} /> : <EyeSlashIcon className={styles.icon} />}
          </button>
        }
        ref={ref}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
