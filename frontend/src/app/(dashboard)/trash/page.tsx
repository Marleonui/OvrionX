"use client";

import { Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function TrashPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-lg font-display font-bold text-text-primary">
          Trash
        </h1>
        <p className="text-text-secondary text-body-md mt-1">
          Recently deleted items
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deleted Items</CardTitle>
          <Badge variant="default" size="sm">
            0
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-text-tertiary">Your trash is empty.</p>
        </CardContent>
      </Card>
    </div>
  );
}
