"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/config/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b hair">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-14 flex items-center gap-6">
        <a href="/" className="flex items-center gap-2 group" aria-label="Clip History — home">
          <Image
            src="/logo.png"
            alt="Clip History"
            width={22}
            height={22}
            className="rounded-lg"
          />
          <span className="font-semibold tracking-tight text-[15px]">
            {siteConfig.name}
          </span>
        </a>

        <div className="ml-auto flex items-center gap-5">
          <a
            href="/changelog"
            className="text-[13px] text-ink-300 hover:text-blue transition-colors"
          >
            版本历史
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-ink-300 hover:text-blue transition-colors"
          >
            GitHub
          </a>
          <ThemeToggle />
          <a
            href="/#install"
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-blue text-white hover:bg-blue-soft text-[13px] font-medium"
          >
            下载
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
