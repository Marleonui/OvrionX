"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "ai";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-elevated text-text-secondary border border-border-subtle",
  success: "bg-orion-teal/10 text-orion-teal border border-orion-teal/20",
  warning: "bg-orion-amber/10 text-orion-amber border border-orion-amber/20",
  error: "bg-orion-coral/10 text-orion-coral border border-orion-coral/20",
  info: "bg-orion-violet/10 text-orion-violet border border-orion-violet/20",
  ai: "bg-gradient-to-r from-orion-teal/15 to-orion-violet/15 text-orion-teal border border-orion-teal/20",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-body-sm",
  md: "px-2.5 py-1 text-body-md",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-full",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              variant === "ai" && "bg-orion-teal",
              variant === "success" && "bg-orion-teal",
              variant === "warning" && "bg-orion-amber",
              variant === "error" && "bg-orion-coral",
              variant === "info" && "bg-orion-violet",
              variant === "default" && "bg-text-tertiary"
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
