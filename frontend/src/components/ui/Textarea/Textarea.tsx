"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";
import styles from "./Textarea.module.css";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, rows = 4, ...props }, ref) => {
    return <textarea className={cn(styles.textarea, className)} ref={ref} rows={rows} {...props} />;
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
