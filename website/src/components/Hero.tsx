"use client";

import Image from "next/image";
import { ArrowDown, Monitor, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageLightbox } from "@/components/ImageLightbox";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-20 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--primary)/10,transparent_50%)]" />

      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/logo.png"
          alt="Clip History"
          width={48}
          height={48}
          className="rounded-xl"
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {siteConfig.name}
        </h1>
      </div>

      <p className="text-xl text-muted-foreground mb-4 max-w-2xl">
        {siteConfig.tagline}
      </p>

      <p className="text-base text-muted-foreground/80 mb-10 max-w-xl">
        {siteConfig.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Button size="lg" render={<a href={siteConfig.downloadLinks.macOS} />}>
          <Laptop className="h-5 w-5" />
          下载 macOS 版
        </Button>
        <Button
          size="lg"
          variant="outline"
          render={<a href={siteConfig.downloadLinks.windows} />}
        >
          <Monitor className="h-5 w-5" />
          下载 Windows 版
        </Button>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <ImageLightbox
          src="/screenshots/home.png"
          alt="Clip History 主界面"
          width={2076}
          height={1428}
          className="w-full h-auto rounded-lg"
          priority
        />
      </div>

      <ArrowDown className="mt-16 h-6 w-6 text-muted-foreground animate-bounce" />
    </section>
  );
}
