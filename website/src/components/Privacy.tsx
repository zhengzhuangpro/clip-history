"use client";

import { Shield, HardDrive, Eye, Lock } from "lucide-react";

const items = [
  {
    icon: HardDrive,
    title: "纯本地存储",
    description: "所有剪贴板数据保存在本地 SQLite 数据库中，不依赖任何云服务",
  },
  {
    icon: Eye,
    title: "无网络请求",
    description: "应用运行时不发送任何数据到外部服务器，无遥测、无追踪",
  },
  {
    icon: Lock,
    title: "完全离线",
    description: "无需联网即可使用全部功能，你的数据始终在你的设备上",
  },
];

export function Privacy() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">隐私优先</h2>
        </div>
        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          你的剪贴板内容属于你自己，我们绝不收集、上传或分享任何数据
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border bg-card"
            >
              <item.icon className="h-10 w-10 text-primary" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
