"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";
import styles from "./Input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, endIcon, startIcon, ...props }, ref) => {
    const paddingClass =
      startIcon && endIcon
        ? styles.padBoth
        : startIcon
          ? styles.padStart
          : endIcon
            ? styles.padEnd
            : styles.padNone;

    return (
      <div className={styles.container}>
        {startIcon && <div className={cn(styles.iconWrapper, styles.startIcon)}>{startIcon}</div>}

        <input className={cn(styles.input, paddingClass, className)} ref={ref} type={type} {...props} />

        {endIcon && <div className={cn(styles.iconWrapper, styles.endIcon)}>{endIcon}</div>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
