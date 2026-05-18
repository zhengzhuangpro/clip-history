"use client";

import { HardDrive, Eye, Lock } from "lucide-react";
import { siteConfig } from "@/config/site";

const icons = [HardDrive, Eye, Lock];

export function Privacy() {
  return (
    <section className="border-b hair">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-24">
        <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-ink-400">
          <span className="sec-tag">[ 05 ] Privacy</span>
        </p>
        <h2 className="mt-2 text-[30px] sm:text-[38px] leading-[1.1] tracking-[-0.025em] font-semibold text-foreground">
          隐私优先。
        </h2>
        <p className="mt-3 text-[15px] text-ink-300 max-w-xl">
          你的剪贴板内容属于你自己，我们绝不收集、上传或分享任何数据
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border hair">
          {siteConfig.privacy.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={item.title} className="card-bg p-6 sm:p-7">
                <Icon className="h-5 w-5 text-ink-400" />
                <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
