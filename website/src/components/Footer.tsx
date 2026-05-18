"use client";

import Image from "next/image";
import { ExternalLink, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t hair">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
          <div className="col-span-2 sm:col-span-1">
            <a href="/" className="flex items-center gap-2" aria-label="Clip History — home">
              <Image
                src="/logo.png"
                alt="Clip History"
                width={22}
                height={22}
                className="rounded-lg"
              />
              <span className="font-semibold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
            </a>
            <p className="mt-3 text-[12.5px] text-ink-400 font-mono leading-relaxed">
              轻量、美观、跨平台
              <br />
              剪贴板历史管理工具
            </p>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-400">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              <li><a className="text-ink-200 hover:text-blue" href="#install">下载</a></li>
              <li><a className="text-ink-200 hover:text-blue" href={siteConfig.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-400">
              Tech
            </p>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              <li><a className="text-ink-200 hover:text-blue" href="https://tauri.app" target="_blank" rel="noopener noreferrer">Tauri</a></li>
              <li><a className="text-ink-200 hover:text-blue" href="https://www.rust-lang.org" target="_blank" rel="noopener noreferrer">Rust</a></li>
              <li><a className="text-ink-200 hover:text-blue" href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-400">
              Community
            </p>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              <li>
                <a className="text-ink-200 hover:text-blue" href={siteConfig.github + "/issues"} target="_blank" rel="noopener noreferrer">
                  反馈 &amp; Issues
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t hair flex flex-wrap items-center justify-between gap-3 text-[12px] font-mono text-ink-400">
          <span className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500/60 fill-red-500/60" /> by{" "}
            <a
              href="https://zhengz.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:text-blue-soft"
            >
              zhengzhuang
            </a>
          </span>
          <span>MIT License · © 2026 Clip History</span>
        </div>
      </div>
    </footer>
  );
}
