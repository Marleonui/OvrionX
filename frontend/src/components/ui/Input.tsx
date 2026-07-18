"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-10 px-3 rounded-input",
              "bg-surface-elevated border border-border-subtle",
              "text-text-primary text-body-md placeholder:text-text-tertiary",
              "transition-all duration-200",
              "focus:border-orion-teal/50 focus:outline-none focus:ring-1 focus:ring-orion-teal/30",
              "hover:border-border-default",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-orion-coral focus:border-orion-coral focus:ring-orion-coral/30",
              leftIcon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-body-sm text-orion-coral">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-body-sm text-text-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
