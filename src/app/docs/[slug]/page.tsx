import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface TableOfContents {
  id: string;
  title: string;
  level: number;
  children?: TableOfContents[];
}

const tableOfContents: TableOfContents[] = [
  {
    id: 'intro',
    title: '1. 简介',
    level: 1,
  },
  {
    id: 'setup',
    title: '2. 环境搭建',
    level: 1,
  },
  {
    id: 'features',
    title: '3. 核心特性',
    level: 1,
    children: [
      {
        id: 'routing',
        title: '3.1 路由系统',
        level: 2,
      },
      {
        id: 'data-fetching',
        title: '3.2 数据获取',
        level: 2,
      },
    ],
  },
];

export default function DocumentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <nav className="sticky top-4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-4">目录</h3>
              <ul className="space-y-3 text-sm">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`${
                        item.id === 'intro'
                          ? 'text-emerald-600 hover:text-emerald-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item.title}
                    </a>
                    {item.children && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <a
                              href={`#${child.id}`}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {child.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <article className="bg-white rounded-lg shadow-sm p-6">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Next.js 最佳实践指南
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  2024-01-15
                </span>
                <span className="mx-2">·</span>
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  预计阅读时间 15 分钟
                </span>
              </div>
            </header>

            {/* Free Preview Content */}
            <div className="prose max-w-none">
              <h2 id="intro" className="text-2xl font-bold text-gray-900 mb-4">
                1. 简介
              </h2>
              <p className="text-gray-600 mb-6">
                Next.js 是一个用于生产环境的 React
                框架，它提供了许多开箱即用的功能，如混合静态与服务器渲染、TypeScript
                支持、智能打包、路由预加载等。本指南将帮助你深入了解 Next.js
                的各项特性，并掌握其最佳实践。
              </p>

              <h2 id="setup" className="text-2xl font-bold text-gray-900 mb-4">
                2. 环境搭建
              </h2>
              <p className="text-gray-600 mb-6">
                使用 create-next-app
                是开始一个新的Next.js项目的最简单方法。它为你提供了一个预配置的项目结构，包含了所有必要的依赖和配置。
              </p>

              {/* Member Unlock Prompt */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
                  <div className="bg-white p-8 text-center rounded-lg shadow-lg max-w-md mx-auto">
                    <svg
                      className="mx-auto h-12 w-12 text-emerald-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      成为会员，解锁完整内容
                    </h3>
                    <p className="text-gray-600 mb-4">
                      订阅会员后可查看本文完整内容，包括详细的代码示例和最佳实践建议。
                    </p>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      立即解锁
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Article Footer */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                点赞
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                收藏
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center text-gray-400 hover:text-gray-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
