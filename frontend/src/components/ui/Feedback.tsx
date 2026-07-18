import { cn } from "@/lib/utils";
import { Loader2, Inbox, AlertTriangle, CheckCircle2 } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("w-5 h-5 animate-spin text-orion-teal", className)} />;
}

export function Loading({
  label = "Loading...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16", className)}>
      <Spinner className="w-7 h-7" />
      <p className="text-body-sm text-text-tertiary">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center px-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-tertiary">
        {icon ?? <Inbox className="w-6 h-6" />}
      </div>
      <div>
        <p className="text-body-md font-medium text-text-primary">{title}</p>
        {description && (
          <p className="text-body-sm text-text-tertiary mt-1 max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center px-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-orion-coral/10 border border-orion-coral/20 flex items-center justify-center text-orion-coral">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <p className="text-body-md font-medium text-text-primary">{title}</p>
        {description && (
          <p className="text-body-sm text-text-tertiary mt-1 max-w-sm">{description}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-body-sm text-orion-teal hover:text-orion-teal/80 font-medium transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function SuccessBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-body-sm text-orion-teal">
      <CheckCircle2 className="w-4 h-4" />
      {children}
    </span>
  );
}
