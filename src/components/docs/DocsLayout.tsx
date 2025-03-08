import Link from 'next/link';
import { getDocsData } from '@/lib/docs';
import type { DocNode } from '@/lib/docs';
import DocsSidebar from './DocsSidebar';
import DocsTableOfContents from './DocsTableOfContents';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export async function DocsLayout({ children }: DocsLayoutProps) {
  // Get the docs data directly from the server
  const docs = await getDocsData();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Sidebar - Navigation Tree */}
        <div className="hidden lg:block lg:col-span-2">
          <nav className="sticky top-4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-4">目录</h3>
              {docs.length === 0 ? (
                <div className="text-gray-500">暂无文档</div>
              ) : (
                <DocsSidebar docs={docs} />
              )}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          {children}
        </div>

        {/* Right Sidebar - Table of Contents */}
        <div className="hidden lg:block lg:col-span-2">
          <DocsTableOfContents />
        </div>
      </div>
    </div>
  );
}