import { Metadata } from 'next';
import Link from 'next/link';
import { getDocsData } from '@/lib/docs';
import type { DocNode } from '@/lib/docs';

export const metadata: Metadata = {
  title: '文档中心',
  description: '浏览所有可用的文档内容',
};

export default async function DocsPage() {
  const docs = await getDocsData();

  if (docs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">文档中心</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">暂无文档</p>
        </div>
      </div>
    );
  }

  // Sort docs by position to ensure they appear in the correct order
  const sortedDocs = [...docs].sort((a, b) => a.position - b.position);

  const renderDocItem = (doc: DocNode) => {
    // 规范化路径
    const normalizedSlug = doc.slug.replace(/^\/+|\/+$/g, '');
    const docPath = normalizedSlug;
    const hasChildren = doc.children && doc.children.length > 0;
    
    console.log('渲染文档链接:', {
      title: doc.title,
      originalSlug: doc.slug,
      normalizedSlug,
      docPath,
      hasChildren
    });
    
    // Sort children by position
    const sortedChildren = hasChildren 
      ? [...doc.children].sort((a, b) => a.position - b.position)
      : [];

    return (
      <div key={doc.node_token} className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
        <div className="text-gray-600 mb-4">
          <p>最后更新：{new Date(parseInt(doc.obj_edit_time) * 1000).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href={`/docs/${docPath}`}
            className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
          >
            阅读更多 <span className="ml-1">→</span>
          </Link>
          {hasChildren && (
            <span className="text-sm text-gray-500">
              {sortedChildren.length} 个子文档
            </span>
          )}
        </div>
        {hasChildren && (
          <div className="mt-4 pl-4 border-l border-gray-200 space-y-4">
            {sortedChildren.map((child: DocNode) => {
              console.log('渲染子文档链接:', {
                parentTitle: doc.title,
                childTitle: child.title,
                childSlug: child.slug,
                childFilename: child.filename
              });
              return renderDocItem(child);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">文档中心</h1>
      <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
        {sortedDocs.map(renderDocItem)}
      </div>
    </div>
  );
}