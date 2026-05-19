import fs from "fs";
import path from "path";

export interface ChangelogSection {
  title: string;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

export function getChangelog(): ChangelogEntry[] {
  const filePath = path.resolve(process.cwd(), "../CHANGELOG.md");
  const raw = fs.readFileSync(filePath, "utf-8");

  // Split into version blocks by "## [version] - date"
  const versionBlocks = raw.split(/^## \[(.+?)]\s*-\s*(.+)$/m);

  const entries: ChangelogEntry[] = [];

  // versionBlocks: [preamble, version, date, content, version, date, content, ...]
  for (let i = 1; i < versionBlocks.length; i += 3) {
    const version = versionBlocks[i];
    const date = versionBlocks[i + 1];
    const content = versionBlocks[i + 2];

    if (!version || version === "Unreleased") continue;

    const sections: ChangelogSection[] = [];
    // Split by "### title"
    const sectionBlocks = content.split(/^### (.+)$/m);

    for (let j = 1; j < sectionBlocks.length; j += 2) {
      const title = sectionBlocks[j];
      const body = sectionBlocks[j + 1] ?? "";
      const items = body
        .split("\n")
        .map((line) => line.replace(/^-\s*/, "").trim())
        .filter((line) => line.length > 0);

      if (items.length > 0) {
        sections.push({ title, items });
      }
    }

    entries.push({ version, date: date.trim(), sections });
  }

  // Sort by version descending (newest first)
  entries.sort((a, b) => {
    const va = a.version.split(".").map(Number);
    const vb = b.version.split(".").map(Number);
    for (let i = 0; i < Math.max(va.length, vb.length); i++) {
      const diff = (vb[i] ?? 0) - (va[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
  });

  return entries;
}
