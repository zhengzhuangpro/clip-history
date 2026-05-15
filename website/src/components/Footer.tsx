"use client";

import Image from "next/image";
import { ExternalLink, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Clip History"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-semibold">{siteConfig.name}</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            <span className="text-sm text-muted-foreground">MIT License</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by
          zhengzhuang
        </p>
      </div>
    </footer>
  );
}
