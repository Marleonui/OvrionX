"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "ai";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-orion-teal text-black hover:bg-orion-teal/90 active:bg-orion-teal/80 shadow-button",
  secondary:
    "bg-surface-elevated border border-border-subtle text-text-primary hover:bg-surface-elevated/80 hover:border-border-default",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
  danger:
    "bg-orion-coral/10 border border-orion-coral/30 text-orion-coral hover:bg-orion-coral/20",
  ai:
    "bg-gradient-to-r from-orion-teal/20 to-orion-violet/20 border border-orion-teal/30 text-orion-teal hover:from-orion-teal/30 hover:to-orion-violet/30 shadow-glow",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-body-sm gap-1.5",
  md: "h-10 px-4 text-body-md gap-2",
  lg: "h-12 px-6 text-body-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-button",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-orion-teal focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
