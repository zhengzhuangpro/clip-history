"use client";

import { Laptop, Monitor, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function DownloadSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">立即下载</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          支持 Windows 10+ 和 macOS 12+，免费使用
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-5 w-5" />
                macOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                下载 .dmg 安装包，拖入 Applications 文件夹即可
              </p>
              <Button
                render={<a href={siteConfig.downloadLinks.macOS} />}
                className="w-full"
              >
                <Download className="h-4 w-4" />
                下载 macOS 版
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Windows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                下载 .msi 安装包，双击运行安装向导
              </p>
              <Button
                render={<a href={siteConfig.downloadLinks.windows} />}
                className="w-full"
              >
                <Download className="h-4 w-4" />
                下载 Windows 版
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  macOS 未签名应用说明
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  首次打开时 macOS 会提示"无法打开，因为无法验证开发者"。
                  请前往 <strong>系统设置 → 隐私与安全性</strong>，
                  在底部找到安全提示，点击"仍要打开"。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
