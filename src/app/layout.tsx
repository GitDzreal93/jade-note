import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
      <body className={`${geist.className} bg-gray-50`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
