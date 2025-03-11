import Link from 'next/link';
import { getDocsData } from '@/lib/docs';
import type { DocNode } from '@/lib/docs';
import DocsSidebar from './DocsSidebar';
import DocsTableOfContentsWrapper from './DocsTableOfContentsWrapper';
import { ClientDocsLayout } from './ClientDocsLayout';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export async function DocsLayout({ children }: DocsLayoutProps) {
  // Get the docs data directly from the server
  const docs = await getDocsData();
  
  return (
    <ClientDocsLayout>
      <div className="max-w-[90rem] mx-auto relative">
        <div className="flex pb-8">
          {/* 左侧边栏 */}
          <aside className="fixed w-72" style={{ top: 'calc(4rem + 2rem)' }}>
            {docs.length > 0 && <DocsSidebar docs={docs} />}
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0 ml-72 mr-64">
            <div className="max-w-4xl mx-auto px-8">
              <div className="pb-8">
                {children}
              </div>
            </div>
          </main>

          {/* 右侧目录 */}
          <aside className="fixed right-[max(0px,calc((100%-90rem)/2))] w-64 hidden xl:block" style={{ top: 'calc(4rem + 2rem)' }}>
            <DocsTableOfContentsWrapper />
          </aside>
        </div>
      </div>
    </ClientDocsLayout>
  );
}