"use client";

import { Apple, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useMacOSDownloadLink } from "@/hooks/useMacOSDownloadLink";

export function Hero() {
  const macOSHref = useMacOSDownloadLink();
  return (
    <section className="relative overflow-hidden border-b hair">
      <div className="absolute inset-0 grid-bg grid-fade pointer-events-none" />
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT: copy */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-[12px] font-mono text-ink-300 border hair rounded-full px-2.5 py-1 mb-6">
              <span className="pulse" aria-hidden="true" />
              <span>clipboard · listening</span>
            </div>
            <h1 className="text-[40px] sm:text-[54px] lg:text-[58px] leading-[1.02] tracking-[-0.025em] font-semibold text-balance text-foreground">
              {siteConfig.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-ink-300">
              {siteConfig.description}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button size="lg" nativeButton={false} render={<a href={macOSHref} />} className="gap-2 bg-blue text-white hover:bg-blue-soft">
                <Apple className="h-4 w-4" />
                下载 macOS 版
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<a href={siteConfig.downloadLinks.windows} />}
                nativeButton={false} className="gap-2 border-border hover:bg-muted"
              >
                <Monitor className="h-4 w-4" />
                下载 Windows 版
              </Button>
            </div>

            <p className="mt-6 text-[12.5px] font-mono text-ink-400">
              built on <span className="text-ink-200">Tauri 2 + Rust</span>
              · macOS · Windows
            </p>
          </div>

          {/* RIGHT: home screenshot (terminal demo hidden) */}
          <div className="lg:col-span-7">
            <div className="split-window code-bg term-shadow overflow-hidden">
              <div className="relative flex items-center h-8 px-3 border-b hair">
                <div className="absolute left-3 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="flex-1 text-center font-mono text-ink-400 text-[11px] font-bold">
                  Clip History
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/home1.png"
                alt="Clip History 主界面"
                className="w-full h-auto"
              />
            </div>
            {/* terminal demo — hidden for now */}
            <div className="hidden">
              <div className="split-window code-bg term-shadow">
                <div className="flex items-center gap-1.5 h-8 px-3 border-b hair">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 font-mono text-ink-400 text-[11px]">
                    clip-history — workspace
                  </span>
                </div>
                <div className="px-4 py-4 font-mono text-[13px] leading-[1.7] text-ink-100">
                  <div>
                    <span className="text-blue">$</span>{" "}
                    <span className="tk-bin">clip-history</span> status
                  </div>
                  <div className="text-ink-300 mt-1">
                    <span className="text-blue">●</span> listening on clipboard
                  </div>
                  <div className="text-ink-300">
                    records: <span className="text-blue">1,247</span> · images:{" "}
                    <span className="text-blue">89</span> · storage:{" "}
                    <span className="text-blue">12.3MB</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-blue">$</span>{" "}
                    <span className="tk-bin">clip-history</span> search{" "}
                    <span className="tk-str">&quot;API key&quot;</span>
                  </div>
                  <div className="text-ink-400 mt-1">
                    <span className="tk-com"># 找到 3 条匹配记录</span>
                  </div>
                  <div className="text-ink-300">
                    <span className="text-ink-400">09:41</span> sk-xxxx...xxxx{" "}
                    <span className="tk-com">(text)</span>
                  </div>
                  <div className="text-ink-300">
                    <span className="text-ink-400">昨天</span>{" "}
                    api.cliphistory.dev/v1/keys{" "}
                    <span className="tk-com">(text)</span>
                  </div>
                  <div className="text-ink-300">
                    <span className="text-ink-400">05/12</span> Bearer eyJhbG...{" "}
                    <span className="tk-com">(text)</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-blue">$</span>{" "}
                    <span className="tk-bin">clip-history</span> copy 1{" "}
                    <span className="text-blue">✓ copied</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-blue">$</span>{" "}
                    <span className="caret" />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 font-mono text-[11.5px] text-ink-400 text-center sm:text-right">
              输入关键词 → 毫秒级搜索 → 一键复制。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
