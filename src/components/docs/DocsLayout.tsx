'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Sidebar - Navigation Tree */}
        <div className="hidden lg:block lg:col-span-3">
          <nav className="sticky top-4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="space-y-1">
                <div className="font-medium">入门指南</div>
                <ul className="pl-4 space-y-1">
                  <li>
                    <a href="/docs/getting-started" className={clsx('text-gray-600 hover:text-gray-900', pathname === '/docs/getting-started' && 'text-emerald-600 font-medium')}>快速开始</a>
                  </li>
                  <li>
                    <a href="/docs/concepts" className={clsx('text-gray-600 hover:text-gray-900', pathname === '/docs/concepts' && 'text-emerald-600 font-medium')}>基础概念</a>
                  </li>
                </ul>
                <div className="font-medium mt-4">核心功能</div>
                <ul className="pl-4 space-y-1">
                  <li>
                    <a href="/docs/writing" className={clsx('text-gray-600 hover:text-gray-900', pathname === '/docs/writing' && 'text-emerald-600 font-medium')}>文档编写</a>
                  </li>
                  <li>
                    <a href="/docs/membership" className={clsx('text-gray-600 hover:text-gray-900', pathname === '/docs/membership' && 'text-emerald-600 font-medium')}>会员解锁</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-7">
          <article className="bg-white rounded-lg shadow-sm p-6 prose prose-emerald max-w-none">
            {children}
          </article>
        </div>

        {/* Right Sidebar - Table of Contents */}
        <div className="hidden lg:block lg:col-span-2">
          {mounted && (
            <div className="sticky top-4">
              <div className={clsx('py-4 pl-4', 'border-l border-gray-200')}>
                {/* Table of Contents will be rendered by MDX */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}