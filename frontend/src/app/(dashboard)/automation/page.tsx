"use client";

import { Zap, Workflow, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const automations = [
  { name: "Daily Standup Reminder", trigger: "Cron 09:00", status: "active" },
  { name: "Auto-tag Documents", trigger: "On Upload", status: "active" },
  { name: "Weekly BI Report", trigger: "Cron Mon 08:00", status: "paused" },
];

export default function AutomationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            Automation
          </h1>
          <p className="text-text-secondary text-body-md mt-1">
            Workflows that run themselves
          </p>
        </div>
        <Button variant="ai" leftIcon={<Plus className="w-4 h-4" />}>
          New Automation
        </Button>
      </div>

      <div className="space-y-3">
        {automations.map((a) => (
          <Card key={a.name} variant="interactive">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Workflow className="w-5 h-5 text-orion-teal" />
                <div>
                  <p className="text-body-md font-medium text-text-primary">{a.name}</p>
                  <p className="text-body-sm text-text-tertiary">{a.trigger}</p>
                </div>
              </div>
              <Badge variant={a.status === "active" ? "success" : "warning"} size="sm">
                {a.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
