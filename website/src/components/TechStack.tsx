"use client";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

export function TechStack() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">技术架构</h2>
        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          基于现代技术栈打造，兼顾性能与体验
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-2 p-6 rounded-xl border bg-card min-w-[140px]"
            >
              <Badge variant="secondary" className="text-sm">
                {tech.name}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {tech.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">~5MB</p>
            <p className="text-sm text-muted-foreground">安装包体积</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">&lt;30MB</p>
            <p className="text-sm text-muted-foreground">内存占用</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">&lt;100ms</p>
            <p className="text-sm text-muted-foreground">搜索响应</p>
          </div>
        </div>
      </div>
    </section>
  );
}
