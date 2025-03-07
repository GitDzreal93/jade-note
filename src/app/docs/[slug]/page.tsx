import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';

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
    <article className="bg-white rounded-lg shadow-sm p-6">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Next.js 最佳实践指南
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <span className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            2024-01-15
          </span>
          <span className="mx-2">·</span>
          <span className="flex items-center">
            <ClockIcon className="mr-2 h-4 w-4" />
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

      {/* Article Footer */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <HandThumbUpIcon className="mr-2 h-5 w-5" />
            点赞
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <BookmarkIcon className="mr-2 h-5 w-5" />
            收藏
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center text-gray-400 hover:text-gray-500">
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
