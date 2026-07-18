"use client";

import { Settings as SettingsIcon, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-lg font-display font-bold text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary text-body-md mt-1">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-body-sm text-text-secondary">Display Name</label>
            <Input defaultValue={user?.displayName ?? ""} />
          </div>
          <div>
            <label className="text-body-sm text-text-secondary">Email</label>
            <Input defaultValue={user?.email ?? ""} disabled />
          </div>
          <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
