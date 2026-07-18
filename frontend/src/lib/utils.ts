import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date using Intl.DateTimeFormat with ORION X standard formatting.
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(d);
}

/**
 * Formats a time string (HH:mm) from a Date object.
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Formats a date as relative time string (e.g., "in 2 Stunden", "vor 5 Minuten").
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  const isPast = diffMs < 0;
  const abs = Math.abs;

  const rtf = new Intl.RelativeTimeFormat("de-DE", { numeric: "auto" });

  if (abs(diffSeconds) < 60) return rtf.format(isPast ? 0 : 0, "second");
  if (abs(diffMinutes) < 60) return rtf.format(isPast ? diffMinutes : diffMinutes, "minute");
  if (abs(diffHours) < 24) return rtf.format(isPast ? diffHours : diffHours, "hour");
  if (abs(diffDays) < 30) return rtf.format(isPast ? diffDays : diffDays, "day");
  return formatDate(d);
}

/**
 * Truncates text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generates a random UUID v4 string.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Safely parses JSON with a fallback value.
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Formats a number as currency in EUR.
 */
export function formatCurrency(
  amount: number,
  currency: string = "EUR"
): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number with thousand separators.
 */
export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("de-DE", options).format(number);
}

/**
 * Returns a color based on priority level for UI indicators.
 */
export function getPriorityColor(
  priority: "low" | "medium" | "high" | "critical"
): string {
  const colors = {
    low: "var(--color-text-tertiary)",
    medium: "var(--color-orion-amber)",
    high: "var(--color-orion-coral)",
    critical: "var(--color-orion-coral)",
  };
  return colors[priority];
}

/**
 * Returns a color based on task/project status.
 */
export function getStatusColor(
  status: "backlog" | "todo" | "in_progress" | "review" | "done" | "active" | "paused" | "completed"
): string {
  const colors: Record<string, string> = {
    backlog: "var(--color-text-tertiary)",
    todo: "var(--color-text-secondary)",
    in_progress: "var(--color-orion-violet)",
    review: "var(--color-orion-amber)",
    done: "var(--color-orion-teal)",
    active: "var(--color-orion-teal)",
    paused: "var(--color-orion-amber)",
    completed: "var(--color-orion-teal)",
  };
  return colors[status] ?? "var(--color-text-tertiary)";
}
