"use client";

import {
  ClipboardList,
  FileText,
  Search,
  Eye,
  Copy,
  Keyboard,
  Inbox,
  Feather,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const iconStyles: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; bg: string; color: string }
> = {
  "clipboard-list": {
    icon: ClipboardList,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    color: "text-blue-600 dark:text-blue-400",
  },
  "file-text": {
    icon: FileText,
    bg: "bg-purple-100 dark:bg-purple-900/30",
    color: "text-purple-600 dark:text-purple-400",
  },
  search: {
    icon: Search,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    color: "text-amber-600 dark:text-amber-400",
  },
  eye: {
    icon: Eye,
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  copy: {
    icon: Copy,
    bg: "bg-rose-100 dark:bg-rose-900/30",
    color: "text-rose-600 dark:text-rose-400",
  },
  keyboard: {
    icon: Keyboard,
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    color: "text-cyan-600 dark:text-cyan-400",
  },
  tray: {
    icon: Inbox,
    bg: "bg-orange-100 dark:bg-orange-900/30",
    color: "text-orange-600 dark:text-orange-400",
  },
  feather: {
    icon: Feather,
    bg: "bg-teal-100 dark:bg-teal-900/30",
    color: "text-teal-600 dark:text-teal-400",
  },
};

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">核心功能</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          为高效工作而生，每一个功能都经过精心设计
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.features.map((feature) => {
            const style = iconStyles[feature.icon];
            const Icon = style?.icon;
            return (
              <Card key={feature.title} className="border-muted/50">
                <CardHeader>
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center mb-2 ${style?.bg ?? "bg-primary/10"}`}
                  >
                    {Icon && (
                      <Icon
                        className={`h-5 w-5 ${style?.color ?? "text-primary"}`}
                      />
                    )}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
