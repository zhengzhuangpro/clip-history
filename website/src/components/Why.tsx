"use client";

import { siteConfig } from "@/config/site";

export function Why() {
  const { why } = siteConfig;
  return (
    <section className="border-b hair">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28 text-center">
        <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-ink-400">
          <span className="sec-tag">[ 01 ] Why</span>
        </p>
        <p className="pull-quote mt-6 max-w-4xl mx-auto text-foreground">
          {why.quote.split("\n").map((line, i) => (
            <span key={i}>
              {i === 1 ? <em>{line}</em> : line}
              {i === 0 && <br />}
            </span>
          ))}
        </p>
        <p className="mt-7 max-w-2xl mx-auto text-[15.5px] leading-[1.65] text-ink-300">
          {why.description}
        </p>

        {/* Evidence chip */}
        {/* <div className="mt-10 inline-flex items-stretch max-w-full rounded-lg border hair-strong code-bg font-mono text-[12.5px] overflow-x-auto">
          <span className="px-3 py-2 text-ink-400 border-r hair">$</span>
          <span className="px-3 py-2 text-ink-100 whitespace-nowrap">
            <span className="tk-bin">{why.evidence.cmd}</span>
          </span>
          <span className="px-3 py-2 border-l hair text-ink-300 whitespace-nowrap">
            {why.evidence.output}
          </span>
          <span className="px-3 py-2 border-l hair flex items-center gap-1.5 text-blue">
            <span className="pulse" /> live
          </span>
        </div> */}
      </div>
    </section>
  );
}
