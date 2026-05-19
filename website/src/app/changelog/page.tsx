import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { getChangelog } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "版本历史",
  description:
    "Clip History 版本发布记录。查看每个版本的新功能、修复和改进。",
};

function getBadgeInfo(
  version: string,
  sections: { title: string }[]
): { label: string; className: string } {
  if (version === "0.1.0") {
    return { label: "初始版本", className: "bg-blue text-white" };
  }
  const hasAdded = sections.some((s) => s.title === "新增");
  if (hasAdded) {
    return { label: "新功能", className: "bg-blue text-white" };
  }
  return { label: "修复", className: "bg-secondary text-secondary-foreground" };
}

function renderMarkdownText(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function ChangelogPage() {
  const entries = getChangelog();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden border-b hair">
          <div className="absolute inset-0 grid-bg grid-fade pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-14 sm:pt-20 pb-12">
            <p className="sec-tag">[ 00 ]</p>
            <h1 className="mt-4 text-[36px] sm:text-[48px] leading-[1.05] tracking-[-0.025em] font-semibold text-foreground">
              版本历史
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-300">
              每一次更新都让剪贴板管理变得更好。以下是 Clip History
              的完整版本发布记录。
            </p>
          </div>
        </section>

        {/* Version list */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
          <div className="space-y-8">
            {entries.map((entry) => {
              const badge = getBadgeInfo(entry.version, entry.sections);
              return (
                <article
                  key={entry.version}
                  className="split-window code-bg term-shadow"
                >
                  {/* Terminal chrome */}
                  <div className="relative flex items-center h-8 px-3 border-b hair">
                    <div className="absolute left-3 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="flex-1 text-center font-mono text-ink-400 text-[11px] font-bold">
                      v{entry.version}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="px-5 sm:px-6 py-5">
                    {/* Title row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[18px] font-semibold text-blue">
                        v{entry.version}
                      </span>
                      <span className="font-mono text-[13px] text-ink-400">
                        {entry.date}
                      </span>
                      <Badge className={badge.className}>{badge.label}</Badge>
                    </div>

                    {/* Sections */}
                    <div className="mt-5 space-y-4">
                      {entry.sections.map((section) => (
                        <div key={section.title}>
                          <h3 className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-400 mb-2">
                            {section.title}
                          </h3>
                          <ul className="space-y-1.5">
                            {section.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-[14px] leading-relaxed text-ink-200 font-mono"
                              >
                                <span className="text-ink-500 mr-2">-</span>
                                {renderMarkdownText(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t hair">
                      <a
                        href={`https://github.com/zhengzhuangpro/clip-history/releases/tag/v${entry.version}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[13px] font-mono text-ink-300 hover:text-blue transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        GitHub Release
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}