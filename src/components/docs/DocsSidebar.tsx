'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import type { DocNode } from '@/lib/docs';

export function DocsSidebar({ docs }: { docs: DocNode[] }) {
  const pathname = usePathname();
  
  // Sort docs by position to ensure correct order
  const sortedDocs = [...docs].sort((a, b) => a.position - b.position);
  
  // Group docs by categories based on the structure in docs.json
  const categories = [
    {
      title: "入门指南",
      items: sortedDocs.filter(doc => 
        doc.title === "快速开始" || 
        doc.title === "基础概念"
      )
    },
    {
      title: "核心功能",
      items: sortedDocs.filter(doc => 
        doc.title === "开发指南" || 
        doc.title === "最佳实践" ||
        doc.title === "文档编写" ||
        doc.title === "会员解锁"
      )
    }
  ];

  // Render a doc link with proper active state
  const renderDocLink = (doc: DocNode) => {
    const docPath = `/docs/${doc.slug}`;
    const isActive = pathname === docPath;
    
    return (
      <li key={doc.node_token}>
        <Link 
          href={docPath} 
          className={clsx(
            'text-gray-600 hover:text-gray-900 block py-1', 
            isActive && 'text-emerald-600 font-medium'
          )}
        >
          {doc.title}
        </Link>
      </li>
    );
  };

  // Render child docs for a parent doc
  const renderChildDocs = (parentDoc: DocNode) => {
    if (!parentDoc.children || parentDoc.children.length === 0) return null;
    
    const sortedChildren = [...parentDoc.children].sort((a, b) => a.position - b.position);
    
    return (
      <ul className="pl-4 space-y-1 mt-1">
        {sortedChildren.map(child => renderDocLink(child))}
      </ul>
    );
  };

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <div key={index} className="space-y-1">
          <div className="font-medium">{category.title}</div>
          <ul className="pl-4 space-y-1">
            {category.items.map(doc => (
              <li key={doc.node_token}>
                <Link 
                  href={`/docs/${doc.slug}`} 
                  className={clsx(
                    'text-gray-600 hover:text-gray-900 block py-1', 
                    pathname === `/docs/${doc.slug}` && 'text-emerald-600 font-medium'
                  )}
                >
                  {doc.title}
                </Link>
                {doc.children && doc.children.length > 0 && renderChildDocs(doc)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
