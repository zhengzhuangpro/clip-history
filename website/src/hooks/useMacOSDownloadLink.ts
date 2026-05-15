"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

export function useMacOSDownloadLink() {
  const [href, setHref] = useState<string>(siteConfig.downloadLinks.macOSArm);

  useEffect(() => {
    const ua = navigator.userAgent;
    // Apple Silicon: Safari/Chrome report "Mac OS X" without "Intel" and use ARM
    const isIntel = ua.includes("Intel") && ua.includes("Mac OS X");
    setHref(
      isIntel
        ? siteConfig.downloadLinks.macOSIntel
        : siteConfig.downloadLinks.macOSArm
    );
  }, []);

  return href;
}
