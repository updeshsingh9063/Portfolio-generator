"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full bg-surface text-foreground placeholder:text-faint font-sans text-[0.9rem] " +
  "border border-line rounded-[var(--radius-md)] transition-[border-color,box-shadow,background-color] " +
  "duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] " +
  "hover:border-line-strong focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/12 " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-error aria-[invalid=true]:ring-error/12";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, startIcon, endIcon, ...props }, ref) => {
    if (startIcon || endIcon) {
      return (
        <div className="relative flex items-center">
          {startIcon && (
            <span className="pointer-events-none absolute left-3.5 text-faint [&_svg]:size-[1.05rem]">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(fieldBase, "h-11", startIcon && "pl-10", endIcon ? "pr-10" : "pr-3.5", className)}
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3.5 text-faint [&_svg]:size-[1.05rem]">{endIcon}</span>
          )}
        </div>
      );
    }
    return <input ref={ref} className={cn(fieldBase, "h-11 px-3.5", className)} {...props} />;
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(fieldBase, "px-3.5 py-3 leading-relaxed resize-y min-h-[5rem]", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
