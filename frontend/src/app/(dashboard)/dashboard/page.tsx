"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Brain,
  ArrowRight,
  Plus,
  FolderKanban,
  ListTodo,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { aiApi } from "@/lib/api";
import { projectsApi } from "@/lib/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const priorityColor: Record<string, string> = {
  critical: "bg-orion-coral",
  high: "bg-orion-amber",
  medium: "bg-orion-teal",
  low: "bg-orion-teal",
};

const priorityVariant: Record<string, "error" | "warning" | "default"> = {
  critical: "error",
  high: "warning",
  medium: "default",
  low: "default",
};

const quickActions = [
  { label: "New Task", icon: Plus, color: "text-orion-teal" },
  { label: "AI Analysis", icon: Brain, color: "text-orion-violet" },
  { label: "New Project", icon: FolderKanban, color: "text-orion-amber" },
  { label: "Quick Report", icon: TrendingUp, color: "text-orion-teal" },
];

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["ai-stats"],
    queryFn: async () => (await aiApi.getStats()).data,
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await projectsApi.list()).data,
  });
  const { data: memory = [] } = useQuery({
    queryKey: ["ai-memory"],
    queryFn: async () => (await aiApi.getMemory()).data,
  });

  const taskByStatus = stats?.taskByStatus ?? {};
  const openTasks =
    (taskByStatus.TODO ?? 0) +
    (taskByStatus.IN_PROGRESS ?? 0) +
    (taskByStatus.REVIEW ?? 0);

  const kpis = [
    {
      label: "Active Projects",
      value: String(stats?.projects ?? 0),
      change: "+new",
      icon: FolderKanban,
      color: "text-orion-teal",
    },
    {
      label: "Open Tasks",
      value: String(openTasks),
      change: "-live",
      icon: ListTodo,
      color: "text-orion-violet",
    },
    {
      label: "Documents",
      value: String(stats?.documents ?? 0),
      change: "+live",
      icon: FileText,
      color: "text-orion-amber",
    },
    {
      label: "AI Insights",
      value: String(stats?.memoryEntries ?? 0),
      change: "+live",
      icon: Brain,
      color: "text-orion-teal",
    },
  ];

  const allTasks = projects.flatMap((p: any) =>
    (p.tasks ?? []).map((t: any) => ({ ...t, projectName: p.name }))
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            Command Center
          </h1>
          <p className="text-body-md mt-1 text-text-secondary">
            Your intelligent workspace overview
          </p>
        </div>
        <Button variant="ai" size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
          AI Analysis
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi) => (
          <Card key={kpi.label} variant="interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-body-sm text-text-secondary">
                  {kpi.label}
                </span>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-heading-lg font-bold text-text-primary">
                  {kpi.value}
                </span>
                <Badge
                  variant={kpi.change.startsWith("+") ? "success" : "warning"}
                  size="sm"
                >
                  {kpi.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Agenda / Tasks */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <Badge variant="default" size="sm">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allTasks.length === 0 && (
                  <p className="text-body-sm text-text-tertiary">
                    No tasks yet. Create one in a project.
                  </p>
                )}
                {allTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-surface-elevated/50 border border-border-subtle hover:bg-surface-elevated transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        priorityColor[task.priority] || "bg-orion-teal"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-medium text-text-primary truncate">
                        {task.title}
                      </p>
                      <p className="text-body-sm text-text-tertiary">
                        {task.projectName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          priorityVariant[task.priority] || "default"
                        }
                        size="sm"
                      >
                        {task.status}
                      </Badge>
                      <span className="text-body-sm text-text-tertiary whitespace-nowrap">
                        {task.priority}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={item} className="space-y-4">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <Badge variant="ai" size="sm" dot>
                Live
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memory.length === 0 && (
                  <p className="text-body-sm text-text-tertiary">
                    No AI memory yet. Teach the assistant in the AI tab.
                  </p>
                )}
                {memory.map((m: any) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg bg-surface-elevated/30 border border-border-subtle"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 bg-orion-teal flex-shrink-0" />
                      <p className="text-body-sm font-medium text-text-primary">
                        {m.content}
                      </p>
                    </div>
                    <p className="text-body-sm text-text-secondary ml-3.5">
                      {m.type}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface-elevated/50 border border-border-subtle hover:bg-surface-elevated hover:border-orion-teal/30 transition-all duration-200 group"
                  >
                    <action.icon
                      className={`w-6 h-6 ${action.color} group-hover:scale-110 transition-transform`}
                    />
                    <span className="text-body-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allTasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orion-teal/30 to-orion-violet/30 flex items-center justify-center text-body-sm font-medium text-orion-teal flex-shrink-0">
                      {(task.assigneeId || "U").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-text-primary">
                        <span className="font-medium">
                          {task.status === "DONE" ? "Completed" : "Active"} task
                        </span>{" "}
                        <span className="text-text-secondary">{task.title}</span>
                      </p>
                    </div>
                    <span className="text-body-sm text-text-tertiary whitespace-nowrap">
                      {task.projectName}
                    </span>
                  </div>
                ))}
                {allTasks.length === 0 && (
                  <p className="text-body-sm text-text-tertiary">
                    No recent activity.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
