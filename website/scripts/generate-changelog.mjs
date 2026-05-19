import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const changelogPath = path.resolve(__dirname, "../CHANGELOG.md");
const outputPath = path.resolve(__dirname, "../src/generated/changelog.json");

const raw = fs.readFileSync(changelogPath, "utf-8");

const versionBlocks = raw.split(/^## \[(.+?)]\s*-\s*(.+)$/m);
const entries = [];

for (let i = 1; i < versionBlocks.length; i += 3) {
  const version = versionBlocks[i];
  const date = versionBlocks[i + 1];
  const content = versionBlocks[i + 2];

  if (!version || version === "Unreleased") continue;

  const sections = [];
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

entries.sort((a, b) => {
  const va = a.version.split(".").map(Number);
  const vb = b.version.split(".").map(Number);
  for (let i = 0; i < Math.max(va.length, vb.length); i++) {
    const diff = (vb[i] ?? 0) - (va[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));

console.log(`Generated ${entries.length} changelog entries → ${outputPath}`);
