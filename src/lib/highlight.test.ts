import { describe, it, expect } from "vitest";
import { splitByHighlight } from "./highlight";

describe("splitByHighlight", () => {
  it("returns single segment when query is empty", () => {
    expect(splitByHighlight("hello world", "")).toEqual([
      { text: "hello world", highlighted: false },
    ]);
  });

  it("returns single segment when query is whitespace", () => {
    expect(splitByHighlight("hello world", "   ")).toEqual([
      { text: "hello world", highlighted: false },
    ]);
  });

  it("highlights single match case-insensitively", () => {
    const result = splitByHighlight("Hello World", "hello");
    expect(result).toEqual([
      { text: "", highlighted: false },
      { text: "Hello", highlighted: true },
      { text: " World", highlighted: false },
    ]);
  });

  it("highlights multiple matches", () => {
    const result = splitByHighlight("abc abc abc", "abc");
    expect(result).toEqual([
      { text: "", highlighted: false },
      { text: "abc", highlighted: true },
      { text: " ", highlighted: false },
      { text: "abc", highlighted: true },
      { text: " ", highlighted: false },
      { text: "abc", highlighted: true },
      { text: "", highlighted: false },
    ]);
  });

  it("escapes regex special characters", () => {
    const result = splitByHighlight("hello (world)", "(world)");
    expect(result).toEqual([
      { text: "hello ", highlighted: false },
      { text: "(world)", highlighted: true },
      { text: "", highlighted: false },
    ]);
  });

  it("handles no match", () => {
    const result = splitByHighlight("hello world", "xyz");
    expect(result).toEqual([{ text: "hello world", highlighted: false }]);
  });

  it("handles empty text", () => {
    expect(splitByHighlight("", "query")).toEqual([
      { text: "", highlighted: false },
    ]);
  });
});
