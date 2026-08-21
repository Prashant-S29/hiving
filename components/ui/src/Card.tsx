import type { HTMLAttributes, ReactNode } from "react";
import "./Card.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  children: ReactNode;
}

/** Base surface container — hairline border + real shadow depth, no heavy outlines. Building block for the product-specific cards below. */
export function Card({ padding = "md", className, children, ...rest }: CardProps) {
  const classes = ["hvg-card", `hvg-card--pad-${padding}`, className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
