"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const FieldIdContext = React.createContext<string | undefined>(undefined);

/**
 * Accessible field wrapper: label + optional hint + error, wired via aria.
 * Give the control `id={useFieldId()}` or just render a single control child —
 * the label's htmlFor is set automatically.
 */
export function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  action,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const generatedId = React.useId();
  const id = htmlFor ?? generatedId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <FieldIdContext.Provider value={id}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        {(label || action) && (
          <div className="flex min-h-[1.25rem] items-center justify-between gap-2">
            {label ? (
              <label htmlFor={id} className="flex items-center gap-1 text-[0.8rem] font-medium text-foreground">
                {label}
                {required && <span className="text-accent-deep">*</span>}
              </label>
            ) : (
              <span />
            )}
            {action}
          </div>
        )}
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
              id,
              "aria-invalid": error ? true : undefined,
              "aria-describedby": describedBy,
            })
          : children}
        {error ? (
          <p id={`${id}-error`} className="text-caption text-error">
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="text-caption text-faint">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldIdContext.Provider>
  );
}

export function useFieldId() {
  return React.useContext(FieldIdContext);
}
