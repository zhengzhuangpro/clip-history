export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function splitByHighlight(text: string, query: string): HighlightSegment[] {
  if (!query.trim()) return [{ text, highlighted: false }];
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part) => ({
    text: part,
    highlighted: regex.test(part),
  }));
}
