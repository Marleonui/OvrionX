"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database, FileText, Trash2, Upload, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loading, EmptyState } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toaster";
import { vaultApi } from "@/lib/api";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function VaultPage() {
  const qc = useQueryClient();
  const toast = useToast();

  const { data: docs, isLoading, isError, refetch } = useQuery({
    queryKey: ["vault"],
    queryFn: async () => (await vaultApi.list()).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vaultApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vault"] });
      toast.success("Document deleted");
    },
    onError: () => toast.error("Failed to delete document"),
  });

  const addDemoMutation = useMutation({
    mutationFn: () =>
      vaultApi.create({
        filename: `Document-${Date.now()}.pdf`,
        mimeType: "application/pdf",
        sizeBytes: Math.floor(Math.random() * 5_000_000) + 100_000,
        storageKey: `documents/${crypto.randomUUID()}`,
        category: "Report",
        tags: ["demo"],
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vault"] });
      toast.success("Document added");
    },
    onError: () => toast.error("Failed to add document"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            Data Vault
          </h1>
          <p className="text-text-secondary text-body-md mt-1">
            Securely stored documents
          </p>
        </div>
        <Button
          variant="ai"
          leftIcon={<Upload className="w-4 h-4" />}
          isLoading={addDemoMutation.isPending}
          onClick={() => addDemoMutation.mutate()}
        >
          Add Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents ({docs?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading label="Loading documents..." />
          ) : isError ? (
            <EmptyState
              icon={<AlertCircle className="w-6 h-6" />}
              title="Could not load vault"
              action={
                <Button variant="secondary" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {docs?.map((d: any) => (
                <div
                  key={d.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-surface-elevated/50 border border-border-subtle"
                >
                  <FileText className="w-5 h-5 text-orion-violet" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-medium text-text-primary truncate">
                      {d.filename}
                    </p>
                    <p className="text-body-sm text-text-tertiary">
                      {formatBytes(d.sizeBytes)}
                      {d.category ? ` · ${d.category}` : ""}
                      {d.aiSummary ? " · AI summarized" : ""}
                    </p>
                  </div>
                  {d.category && <Badge variant="default" size="sm">{d.category}</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(d.id)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  />
                </div>
              ))}
              {docs?.length === 0 && (
                <EmptyState
                  icon={<Database className="w-6 h-6" />}
                  title="No documents stored yet"
                  description="Add your first document to the secure vault."
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
