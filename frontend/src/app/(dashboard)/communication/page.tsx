"use client";

import { MessageSquare, Send, Bot } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function CommunicationPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "How can I help you communicate today?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", content: input.trim() }]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-lg font-display font-bold text-text-primary">
          Communication
        </h1>
        <p className="text-text-secondary text-body-md mt-1">
          AI-assisted messaging & drafts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assistant</CardTitle>
          <Badge variant="ai" size="sm" dot>
            Online
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 min-h-[200px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg text-body-sm ${
                    m.role === "user"
                      ? "bg-orion-teal/20 text-text-primary"
                      : "bg-surface-elevated border border-border-subtle text-text-secondary"
                  }`}
                >
                  {m.role === "assistant" && <Bot className="w-4 h-4 inline mr-1 text-orion-teal" />}
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button variant="ai" leftIcon={<Send className="w-4 h-4" />} onClick={send}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
