"use client";

import { siteConfig } from "@/config/site";

export function Features() {
  const { pillars } = siteConfig;
  return (
    <section className="border-b hair relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 grid-fade pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-ink-400">
          <span className="sec-tag">[ 02 ] Pillars</span>
        </p>
        <h2 className="mt-3 text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.025em] font-semibold text-balance text-foreground">
          三个核心能力。
        </h2>

        <div className="mt-14 grid md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border hair">
          {pillars.map((pillar) => (
            <article key={pillar.number} className="card-bg p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-ink-400">
                <span className="text-blue">[{pillar.number}]</span>
                <span className="dot" />
                {pillar.tag}
              </div>
              <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-300">
                {pillar.description}
              </p>
              <ul className="mt-5 space-y-1.5 text-[12.5px] font-mono text-ink-300">
                {pillar.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue mt-0.5 shrink-0">
                      {point.slice(0, 1)}
                    </span>
                    <span>{point.slice(2)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
