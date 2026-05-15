import { describe, it, expect } from "vitest";
import { cn, blobToDataUrl } from "./utils";

describe("cn", () => {
  it("merges non-conflicting classes", () => {
    expect(cn("p-2", "text-red-500")).toBe("p-2 text-red-500");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles falsy values", () => {
    expect(cn("p-2", false, null, undefined, "text-sm")).toBe("p-2 text-sm");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("blobToDataUrl", () => {
  it("converts Uint8Array to base64 data URL", () => {
    const blob = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    const result = blobToDataUrl(blob);
    expect(result).toBe("data:image/png;base64,iVBORw==");
  });

  it("uses default mime image/png", () => {
    const blob = new Uint8Array([1, 2, 3]);
    const result = blobToDataUrl(blob);
    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it("uses custom mime", () => {
    const blob = new Uint8Array([1, 2, 3]);
    const result = blobToDataUrl(blob, "image/jpeg");
    expect(result).toMatch(/^data:image\/jpeg;base64,/);
  });

  it("handles empty Uint8Array", () => {
    const blob = new Uint8Array([]);
    const result = blobToDataUrl(blob);
    expect(result).toBe("data:image/png;base64,");
  });
});
