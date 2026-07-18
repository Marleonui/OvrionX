"use client";

import { Users, UserPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";

export default function TeamPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            Team
          </h1>
          <p className="text-text-secondary text-body-md mt-1">
            Collaborators in your workspace
          </p>
        </div>
        <Button variant="ai" leftIcon={<UserPlus className="w-4 h-4" />}>
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated/50 border border-border-subtle">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orion-teal to-orion-violet flex items-center justify-center text-body-sm font-bold text-white">
                {user?.displayName?.charAt(0) ?? "U"}
              </div>
              <div className="flex-1">
                <p className="text-body-md font-medium text-text-primary">
                  {user?.displayName ?? "You"}
                </p>
                <p className="text-body-sm text-text-tertiary">{user?.email}</p>
              </div>
              <Badge variant="ai" size="sm">
                {user?.role ?? "USER"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
