import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import "./Input.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  /** Shown under the field in danger red; also drives the border color. */
  error?: string;
}

/** Minimalist bottom-border field. Focus and hover states are real (`:focus`), not simulated. */
export function Input({ label, error, className, ...rest }: InputProps) {
  const id = useId();
  return (
    <div className="hvg-field">
      <label className="hvg-field__label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className={["hvg-field__input", error ? "hvg-field__input--error" : "", className].filter(Boolean).join(" ")} {...rest} />
      {error ? <span className="hvg-field__error">{error}</span> : null}
    </div>
  );
}
