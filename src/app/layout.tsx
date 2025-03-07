import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

const ClientLayout = dynamic(() => import('@/components/layout/ClientLayout'));

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jade Note - 专业的 Markdown 文档平台",
  description: "高质量的技术文档分享平台，让知识传播更加简单。支持 Markdown 格式，提供会员订阅服务。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${geist.className} min-h-screen bg-gray-50 flex flex-col`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
