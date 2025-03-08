'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import type { DocNode } from '@/lib/docs';

// 提取通用的排序函数
const sortByPosition = (items: DocNode[]) => [...items].sort((a, b) => a.position - b.position);

// 提取通用的文档链接组件
const DocLink = ({ doc, isActive }: { doc: DocNode; isActive: boolean }) => (
  <Link 
    href={`/docs/${doc.slug}`} 
    className={clsx(
      'text-gray-600 hover:text-gray-900 block py-1', 
      isActive && 'text-emerald-600 font-medium'
    )}
  >
    {doc.title}
  </Link>
);

export function DocsSidebar({ docs }: { docs: DocNode[] }) {
  const pathname = usePathname();
  
  // Sort docs by position to ensure correct order
  const sortedDocs = sortByPosition(docs);

  // Render child docs for a parent doc
  const renderChildDocs = (parentDoc: DocNode) => {
    if (!parentDoc.children?.length) return null;
    
    const sortedChildren = sortByPosition(parentDoc.children);
    
    return (
      <ul className="pl-4 space-y-1 mt-1">
        {sortedChildren.map(child => (
          <li key={child.node_token}>
            <DocLink doc={child} isActive={pathname === `/docs/${child.slug}`} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-1">
        {sortedDocs.map(doc => (
          <li key={doc.node_token}>
            <DocLink doc={doc} isActive={pathname === `/docs/${doc.slug}`} />
            {doc.children?.length > 0 && renderChildDocs(doc)}
          </li>
        ))}
      </ul>
    </div>
  );
}
