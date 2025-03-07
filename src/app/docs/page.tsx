import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文档中心',
  description: '浏览所有可用的文档内容',
};

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">文档中心</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 文档列表项 */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">入门指南</h2>
          <p className="text-gray-600 mb-4">了解如何开始使用我们的产品和服务</p>
          <a
            href="/docs/getting-started"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            阅读更多 →
          </a>
        </div>
      </div>
    </div>
  );
}