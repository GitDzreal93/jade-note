import { DocsLayout } from '@/components/docs/DocsLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - Jade Note',
    default: 'Jade Note 文档中心'
  },
  description: '基于 Markdown 的付费文档网站'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}