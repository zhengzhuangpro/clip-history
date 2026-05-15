"use client";

import { ImageLightbox } from "@/components/ImageLightbox";

const screenshots = [
  { title: "主界面", src: "/screenshots/1.png" },
  { title: "搜索功能", src: "/screenshots/2.png" },
  { title: "设置面板", src: "/screenshots/3.png" },
];

export function Screenshots() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">界面展示</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          简洁优雅的设计，专注于核心体验
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.title}
              className="flex flex-col items-center gap-3"
            >
              <ImageLightbox
                src={screenshot.src}
                alt={screenshot.title}
                width={1376}
                height={1428}
                className="w-full h-auto max-w-[240px]"
              />
              <p className="text-sm font-medium text-muted-foreground">
                {screenshot.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
