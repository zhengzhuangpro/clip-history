"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/config/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Clip History"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-semibold hidden sm:inline-block">
            {siteConfig.name}
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            render={
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            aria-label="GitHub"
          >
            <ExternalLink className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
