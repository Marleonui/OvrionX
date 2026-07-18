"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, Plus, Trash2, Brain, Activity, FolderKanban, FileText, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toaster";
import { aiApi } from "@/lib/api";

export default function AiPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const [content, setContent] = useState("");

  const { data: memory, isLoading } = useQuery({
    queryKey: ["ai-memory"],
    queryFn: async () => (await aiApi.getMemory()).data,
  });

  const { data: stats } = useQuery({
    queryKey: ["ai-stats"],
    queryFn: async () => (await aiApi.getStats()).data,
  });

  const addMutation = useMutation({
    mutationFn: (content: string) => aiApi.addMemory({ type: "context", content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-memory"] });
      qc.invalidateQueries({ queryKey: ["ai-stats"] });
      setContent("");
      toast.success("Memory added");
    },
    onError: () => toast.error("Failed to add memory"),
  });

  const clearMutation = useMutation({
    mutationFn: () => aiApi.clearMemory(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-memory"] });
      toast.success("Memory cleared");
    },
    onError: () => toast.error("Failed to clear memory"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            AI Assistant
          </h1>
          <p className="text-text-secondary text-body-md mt-1">
            Your personalized AI memory & insights
          </p>
        </div>
        <Badge variant="ai" size="sm" dot>
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FolderKanban className="w-4 h-4 text-orion-teal" />
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
              <Activity className="w-4 h-4 text-orion-violet" />
              <span className="text-body-sm text-text-secondary">Tasks</span>
            </div>
            <span className="text-heading-lg font-bold text-text-primary">
              {stats?.tasks ?? 0}
            </span>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-orion-amber" />
              <span className="text-body-sm text-text-secondary">Memory</span>
            </div>
            <span className="text-heading-lg font-bold text-text-primary">
              {stats?.memoryEntries ?? 0}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Memory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Teach the AI something (e.g. 'Prefer concise summaries')..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && content.trim()) addMutation.mutate(content.trim());
              }}
            />
            <Button
              variant="ai"
              leftIcon={<Plus className="w-4 h-4" />}
              isLoading={addMutation.isPending}
              onClick={() => content.trim() && addMutation.mutate(content.trim())}
            >
              Teach
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Memory Entries</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => clearMutation.mutate()}>
              Clear all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading label="Loading memory..." />
          ) : (
            <div className="space-y-3">
              {memory?.map((m: any) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg bg-surface-elevated/30 border border-border-subtle"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 bg-orion-teal flex-shrink-0" />
                    <div>
                      <p className="text-body-sm text-text-primary">{m.content}</p>
                      <p className="text-body-xs text-text-tertiary mt-1">
                        {m.type} · {new Date(m.createdAt).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {memory?.length === 0 && (
                <EmptyState
                  icon={<Bot className="w-6 h-6" />}
                  title="No memory entries yet"
                  description="Teach the assistant using the form above."
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
