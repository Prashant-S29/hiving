import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. `primary` for the one action per view; `destructive` for flags/reports. */
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md";
  children: ReactNode;
}

/** Hivig Signal Room primary action control — hairline border, real shadow depth, calm hover lift (no bounce). */
export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  const classes = ["hvg-btn", `hvg-btn--${variant}`, `hvg-btn--${size}`, className].filter(Boolean).join(" ");
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
