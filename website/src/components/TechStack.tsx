"use client";

import { siteConfig } from "@/config/site";

export function TechStack() {
  return (
    <section className="border-b hair relative overflow-hidden">
      <svg className="octo-watermark absolute opacity-[0.02]" aria-hidden="true" style={{ right: -40, top: -60, width: 380, height: 380 }}>
        <use href="#octo-outline" />
      </svg>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-ink-400">
            <span className="sec-tag">[ 03 ] Stack</span>
          </p>
          <h2 className="mt-2 text-[30px] sm:text-[38px] leading-[1.1] tracking-[-0.025em] font-semibold text-foreground">
            技术架构。
          </h2>
          <p className="mt-3 text-[15px] text-ink-300 max-w-xl">
            基于现代技术栈打造，兼顾性能与体验。Tauri 2 提供原生性能，Rust
            保证安全，React 构建交互。
          </p>
        </div>

        {/* Architecture layer cake */}
        <div className="mt-14 grid md:grid-cols-[1fr_120px_1fr] items-center gap-y-6 max-w-4xl mx-auto">
          {/* Top: Frontend */}
          <div className="md:col-span-3">
            <div className="mx-auto max-w-md rounded-xl border hair card-bg p-5 text-center">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-ink-400">
                layer · frontend
              </div>
              <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">
                React 18 + TypeScript
              </h3>
              <p className="mt-1 text-[12.5px] text-ink-300 font-mono">
                Tailwind CSS + shadcn/ui
              </p>
            </div>
          </div>

          {/* Wire */}
          <div className="md:col-span-3 flex justify-center">
            <div className="relative h-16 w-px">
              <div className="sse-wire-v absolute inset-0" />
              <div className="sse-pulse go-down" />
              <div className="sse-pulse go-up" />
            </div>
          </div>

          {/* Middle: Core (highlighted) */}
          <div className="md:col-span-3">
            <div className="mx-auto max-w-2xl rounded-2xl border hair-strong card-bg p-6 relative">
              <div className="absolute -top-2.5 left-6 px-2 h-5 grid place-items-center text-[10px] font-mono uppercase tracking-[0.16em] rounded-full bg-blue text-white">
                core · tauri + rust
              </div>
              <div className="grid sm:grid-cols-3 gap-4 items-center mt-1">
                <div className="sm:col-span-1 text-center sm:text-left">
                  <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-ink-400">
                    engine
                  </div>
                  <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">
                    Tauri 2 + Rust
                  </h3>
                  <p className="mt-1 text-[12px] font-mono text-ink-400">
                    原生性能
                  </p>
                </div>
                <div className="sm:col-span-2 grid grid-cols-3 gap-2 text-[11px] font-mono">
                  {siteConfig.techStack.map((tech) => (
                    <div
                      key={tech.name}
                      className="border hair rounded px-2 py-1.5"
                    >
                      <div className="text-ink-400 text-[9.5px]">
                        {tech.description}
                      </div>
                      <div className="text-ink-100">{tech.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wire */}
          <div className="md:col-span-3 flex justify-center">
            <div className="relative h-16 w-px">
              <div className="sse-wire-v absolute inset-0" />
              <div className="sse-pulse go-up" />
              <div className="sse-pulse go-down" style={{ animationDelay: ".8s" }} />
            </div>
          </div>

          {/* Bottom: Storage */}
          <div className="md:col-span-3">
            <div className="mx-auto max-w-md rounded-xl border hair card-bg p-5 text-center">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-ink-400">
                layer · storage
              </div>
              <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">
                SQLite (rusqlite)
              </h3>
              <p className="mt-1 text-[12.5px] text-ink-300 font-mono">
                嵌入式 · 零配置 · 本地持久化
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-[28px] sm:text-[36px] font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-[12.5px] text-ink-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
