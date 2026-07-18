"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderKanban,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderPlus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toaster";
import { projectsApi } from "@/lib/api";

const statusVariant: Record<string, "success" | "warning" | "default" | "error"> = {
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "default",
  ARCHIVED: "default",
};

export default function ProjectsPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const [newName, setNewName] = useState("");

  const { data: projects, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await projectsApi.list()).data,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => projectsApi.create({ name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setNewName("");
      toast.success("Project created");
    },
    onError: () => toast.error("Failed to create project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete project"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            Projects
          </h1>
          <p className="text-text-secondary text-body-md mt-1">
            Manage your active workspaces
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="New project name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) createMutation.mutate(newName.trim());
              }}
            />
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              isLoading={createMutation.isPending}
              onClick={() => newName.trim() && createMutation.mutate(newName.trim())}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Loading label="Loading projects..." />
      ) : isError ? (
        <EmptyState
          icon={<AlertCircle className="w-6 h-6" />}
          title="Could not load projects"
          description="Check your connection and try again."
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((p: any) => (
            <Card key={p.id} variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-orion-teal" />
                    <h3 className="text-body-lg font-semibold text-text-primary truncate">
                      {p.name}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(p.id)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  />
                </div>
                <p className="text-body-sm text-text-secondary mb-4 line-clamp-2">
                  {p.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant={statusVariant[p.status] || "default"} size="sm">
                    {p.status}
                  </Badge>
                  <span className="text-body-sm text-text-tertiary">
                    {p._count?.tasks ?? 0} tasks
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {projects?.length === 0 && (
            <EmptyState
              icon={<FolderPlus className="w-6 h-6" />}
              title="No projects yet"
              description="Create your first project above to get started."
              className="col-span-full"
            />
          )}
        </div>
      )}
    </div>
  );
}
