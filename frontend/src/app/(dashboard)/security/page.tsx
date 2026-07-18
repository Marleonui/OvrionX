"use client";

import { Shield, Key, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-lg font-display font-bold text-text-primary">
          Security
        </h1>
        <p className="text-text-secondary text-body-md mt-1">
          Protect your ORION X account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <Badge variant="success" size="sm">
            JWT Active
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated/50 border border-border-subtle">
            <Key className="w-5 h-5 text-orion-teal" />
            <div className="flex-1">
              <p className="text-body-md text-text-primary">API Keys</p>
              <p className="text-body-sm text-text-tertiary">Manage programmatic access</p>
            </div>
            <Button variant="secondary" size="sm">
              Manage
            </Button>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated/50 border border-border-subtle">
            <AlertTriangle className="w-5 h-5 text-orion-amber" />
            <div className="flex-1">
              <p className="text-body-md text-text-primary">Sessions</p>
              <p className="text-body-sm text-text-tertiary">Active login sessions</p>
            </div>
            <Button variant="danger" size="sm">
              Revoke All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
