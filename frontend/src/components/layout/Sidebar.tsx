"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  Database,
  BarChart3,
  Zap,
  MessageSquare,
  Users,
  Settings,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const primaryNav: NavItem[] = [
  { label: "Command Center", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Projects", href: "/projects", icon: <FolderKanban className="w-5 h-5" /> },
  { label: "AI Assistant", href: "/ai", icon: <Bot className="w-5 h-5" /> },
  { label: "Data Vault", href: "/vault", icon: <Database className="w-5 h-5" /> },
  { label: "Business Intelligence", href: "/bi", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Automation", href: "/automation", icon: <Zap className="w-5 h-5" /> },
  { label: "Communication", href: "/communication", icon: <MessageSquare className="w-5 h-5" /> },
  { label: "Team", href: "/team", icon: <Users className="w-5 h-5" /> },
];

const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  { label: "Security", href: "/security", icon: <Shield className="w-5 h-5" /> },
  { label: "Trash", href: "/trash", icon: <Trash2 className="w-5 h-5" /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col",
        "bg-orion-black border-r border-border-subtle",
        "transition-all duration-300 ease-out",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-4 border-b border-border-subtle">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 border-2 border-orion-teal rounded-full animate-pulse-glow" />
            <div className="absolute inset-1 border border-orion-violet rounded-full" />
            <div className="absolute inset-3 bg-orion-teal rounded-full" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-heading-sm font-display font-bold text-text-primary whitespace-nowrap overflow-hidden"
              >
                ORION X
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {primaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "group relative",
              isActive(item.href)
                ? "bg-orion-teal/10 text-orion-teal border border-orion-teal/20"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 hover:border-transparent border border-transparent"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-body-md font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {isActive(item.href) && (
              <motion.div
                layoutId="active-nav"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orion-teal rounded-r-full"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-2 pb-2 space-y-1">
        {secondaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              isActive(item.href)
                ? "bg-orion-teal/10 text-orion-teal"
                : "text-text-tertiary hover:text-text-secondary hover:bg-surface-elevated/50"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="text-body-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>

      {/* User Area */}
      <div className="border-t border-border-subtle p-2">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-body-sm font-medium text-text-primary truncate">
              {user.displayName}
            </p>
            <p className="text-body-sm text-text-tertiary truncate">
              {user.email}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className={cn(
              "text-text-tertiary hover:text-orion-coral",
              collapsed ? "justify-center w-full" : "flex-1"
            )}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            {!collapsed && "Sign out"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-text-tertiary hover:text-text-primary"
            leftIcon={
              collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )
            }
          />
        </div>
      </div>
    </aside>
  );
}
