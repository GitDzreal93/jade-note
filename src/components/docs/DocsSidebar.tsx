'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import type { DocNode } from '@/lib/docs';

// 提取通用的排序函数
const sortByPosition = (items: DocNode[]) => [...items].sort((a, b) => a.position - b.position);

// 提取通用的文档链接组件
const DocLink = ({ doc, isActive }: { doc: DocNode; isActive: boolean }) => {
  // 规范化链接路径
  const href = `/docs/${doc.slug.replace(/^\/+|\/+$/g, '')}`;
  
  console.log('渲染文档链接:', { 
    title: doc.title, 
    slug: doc.slug,
    href,
    isActive 
  });
  
  return (
    <Link 
      href={href}
      className={clsx(
        'text-gray-600 hover:text-gray-900 block py-1', 
        isActive && 'text-emerald-600 font-medium'
      )}
    >
      {doc.title}
    </Link>
  );
};

export default function DocsSidebar({ docs }: { docs: DocNode[] }) {
  const pathname = usePathname();
  console.log('当前路径:', pathname);
  
  // Sort docs by position to ensure correct order
  const sortedDocs = sortByPosition(docs);
  console.log('文档数据:', docs.map(d => ({ 
    title: d.title, 
    slug: d.slug, 
    children: d.children?.map(c => ({ title: c.title, slug: c.slug })) 
  })));

  // 检查一个文档是否处于活动状态
  const isDocActive = (doc: DocNode) => {
    // 规范化路径，移除开头和结尾的斜杠
    const normalizedPathname = pathname?.replace(/^\/+|\/+$/g, '');
    const normalizedDocPath = `docs/${doc.slug}`.replace(/^\/+|\/+$/g, '');
    
    // 检查是否为当前文档或其子文档
    const isCurrentDoc = normalizedPathname === normalizedDocPath;
    const isChildDoc = doc.children?.some(child => {
      const normalizedChildPath = `docs/${child.slug}`.replace(/^\/+|\/+$/g, '');
      const isMatch = normalizedChildPath === normalizedPathname;
      console.log('检查子文档匹配:', {
        childTitle: child.title,
        childSlug: child.slug,
        normalizedChildPath,
        normalizedPathname,
        isMatch
      });
      return isMatch;
    });
    
    console.log('检查文档活动状态:', { 
      title: doc.title,
      normalizedPathname,
      normalizedDocPath,
      isCurrentDoc,
      isChildDoc
    });
    
    return isCurrentDoc || isChildDoc;
  };

  // Render child docs for a parent doc
  const renderChildDocs = (parentDoc: DocNode) => {
    if (!parentDoc.children?.length) return null;
    
    const sortedChildren = sortByPosition(parentDoc.children);
    console.log('渲染子文档:', { 
      parent: parentDoc.title, 
      parentSlug: parentDoc.slug,
      children: sortedChildren.map(c => ({ title: c.title, slug: c.slug }))
    });
    
    return (
      <ul className="pl-4 space-y-1 mt-1">
        {sortedChildren.map(child => (
          <li key={child.node_token}>
            <DocLink doc={child} isActive={isDocActive(child)} />
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
            <DocLink doc={doc} isActive={isDocActive(doc)} />
            {doc.children?.length > 0 && renderChildDocs(doc)}
          </li>
        ))}
      </ul>
    </div>
  );
}
