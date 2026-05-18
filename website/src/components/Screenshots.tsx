"use client";

import { ImageLightbox } from "@/components/ImageLightbox";

const screenshots = [
  { title: "主界面", src: "/screenshots/1.png" },
  { title: "搜索功能", src: "/screenshots/2.png" },
  { title: "设置面板", src: "/screenshots/3.png" },
];

export function Screenshots() {
  return (
    <section className="border-b hair">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-24">
        <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-ink-400">
          <span className="sec-tag">[ 04 ] Interface</span>
        </p>
        <h2 className="mt-2 text-[30px] sm:text-[38px] leading-[1.1] tracking-[-0.025em] font-semibold text-foreground">
          界面展示。
        </h2>
        <p className="mt-3 text-[15px] text-ink-300 max-w-xl">
          简洁优雅的设计，专注于核心体验
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.title}
              className="flex flex-col items-center gap-3 group"
            >
              {/* <div className="relative w-full max-w-[240px] rounded-xl overflow-hidden border hair transition-transform duration-300 group-hover:scale-[1.02] term-shadow"> */}
              <ImageLightbox
                src={screenshot.src}
                alt={screenshot.title}
                width={1376}
                height={1428}
                className="w-full h-auto"
              />
              {/* </div> */}
              <span className="font-mono text-[11px] text-ink-400">
                {screenshot.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
