"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, CheckCircle2, Clock, ListTodo, FolderKanban } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { aiApi } from "@/lib/api";

const statusColor: Record<string, string> = {
  DONE: "bg-orion-teal",
  IN_PROGRESS: "bg-orion-violet",
  REVIEW: "bg-orion-amber",
  TODO: "bg-orion-blue",
  BACKLOG: "bg-orion-coral",
};

export default function BiPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["ai-stats"],
    queryFn: async () => (await aiApi.getStats()).data,
  });

  const total = stats
    ? (Object.values(stats.taskByStatus) as number[]).reduce((a: number, b: number) => a + b, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-lg font-display font-bold text-text-primary">
          Business Intelligence
        </h1>
        <p className="text-text-secondary text-body-md mt-1">
          Real-time insights from your workspace
        </p>
      </div>

      {isLoading ? (
        <Loading label="Loading analytics..." />
      ) : (
        <>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FolderKanbanIcon />
              <span className="text-body-sm text-text-secondary">Projects</span>
            </div>
            <span className="text-heading-lg font-bold text-text-primary">
              {stats?.projects ?? 0}
            </span>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ListTodo className="w-4 h-4 text-orion-violet" />
              <span className="text-body-sm text-text-secondary">Total Tasks</span>
            </div>
            <span className="text-heading-lg font-bold text-text-primary">{total}</span>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-orion-teal" />
              <span className="text-body-sm text-text-secondary">Done</span>
            </div>
            <span className="text-heading-lg font-bold text-text-primary">
              {stats?.taskByStatus?.DONE ?? 0}
            </span>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orion-amber" />
              <span className="text-body-sm text-text-secondary">Documents</span>
            </div>
            <span className="text-heading-lg font-bold text-text-primary">
              {stats?.documents ?? 0}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
          <Badge variant="default" size="sm">
            <TrendingUp className="w-3 h-3" /> Live
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-text-tertiary">Loading analytics...</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats?.taskByStatus ?? {}).map(([status, count]) => {
                const c = count as number;
                const pct = total ? Math.round((c / total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-sm text-text-secondary">{status}</span>
                      <span className="text-body-sm text-text-tertiary">{c}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                      <div
                        className={`h-full ${statusColor[status] || "bg-orion-teal"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {total === 0 && (
                <p className="text-text-tertiary">No task data available yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {total === 0 && (
        <EmptyState
          icon={<BarChart3 className="w-6 h-6" />}
          title="No analytics yet"
          description="Create projects and tasks to see insights here."
        />
      )}
      </>
      )}
    </div>
  );
}

function FolderKanbanIcon() {
  return <FolderKanban className="w-4 h-4 text-orion-teal" />;
}
