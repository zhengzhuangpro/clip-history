"use client";

import { Apple, Monitor, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useMacOSDownloadLink } from "@/hooks/useMacOSDownloadLink";

export function DownloadSection() {
  const macOSHref = useMacOSDownloadLink();
  return (
    <section id="install" className="border-b hair relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-ink-400">
            <span className="sec-tag">[ 06 ] Install</span>
          </p>
          <h2 className="mt-2 text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.025em] font-semibold text-balance text-foreground">
            两步安装，立即使用。
          </h2>

          <div className="mt-9 rounded-xl border hair-strong code-bg term-shadow overflow-hidden text-left">
            <div className="flex items-center gap-2 px-3.5 h-9 border-b hair text-[11.5px] font-mono text-ink-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2">~/download</span>
            </div>
            <div className="px-5 sm:px-6 py-5 sm:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-[13px] text-ink-200">
                    <Apple className="h-4 w-4 text-ink-400" />
                    macOS
                  </div>
                  <p className="text-[12px] text-ink-400">
                    .dmg 安装包，拖入 Applications
                  </p>
                  <Button
                    render={<a href={macOSHref} />}
                    nativeButton={false}                    className="w-full bg-blue text-white hover:bg-blue-soft"
                    size="sm"
                  >
                    下载 macOS 版
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-[13px] text-ink-200">
                    <Monitor className="h-4 w-4 text-ink-400" />
                    Windows
                  </div>
                  <p className="text-[12px] text-ink-400">
                    .exe 安装包，双击运行
                  </p>
                  <Button
                    render={<a href={siteConfig.downloadLinks.windows} />}
                    nativeButton={false}                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    下载 Windows 版
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-[14.5px] text-ink-300">
            支持 Windows 10+ 和 macOS 12+，免费使用
          </p>
          <p className="mt-2 text-[12.5px] font-mono text-ink-400">
            macOS 未签名应用首次打开需执行{" "}
            <code>xattr -cr /Applications/Clip\ History.app</code>
          </p>
        </div>
      </div>
    </section>
  );
}
