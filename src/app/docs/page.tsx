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

  // 将所有文档（包括子文档）平铺成一个数组
  const flattenDocs = (docs: DocNode[]): DocNode[] => {
    return docs.reduce((acc: DocNode[], doc) => {
      acc.push(doc);
      if (doc.children && doc.children.length > 0) {
        acc.push(...flattenDocs(doc.children));
      }
      return acc;
    }, []);
  };

  // 获取所有文档并按编辑时间排序
  const allDocs = flattenDocs(docs);
  const sortedDocs = allDocs.sort((a, b) => 
    parseInt(b.obj_edit_time) - parseInt(a.obj_edit_time)
  );

  const renderDocItem = (doc: DocNode) => {
    const normalizedSlug = doc.slug.replace(/^\/+|\/+$/g, '');
    const docPath = normalizedSlug;
    
    return (
      <div key={doc.node_token} className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white h-full">
        <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
        <div className="text-gray-600 mb-4">
          <p>最后更新：{new Date(parseInt(doc.obj_edit_time) * 1000).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <Link
            href={`/docs/${docPath}`}
            className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
          >
            阅读更多 <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">文档中心</h1>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedDocs.map(renderDocItem)}
        </div>
      </div>
    </div>
  );
}