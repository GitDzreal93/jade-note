'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DocNode } from '@/lib/docs';
import { Search } from 'lucide-react';
import { SearchPopover } from './SearchPopover';
import { createPortal } from 'react-dom';

interface DocsSearchProps {
  docs: DocNode[];
}

interface SearchResult {
  title: string;
  slug: string;
  parentTitle?: string;
  preview?: string;
  isParent?: boolean;
}

export function DocsSearch({ docs }: DocsSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 在客户端挂载后设置mounted为true
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 搜索文档
  const searchDocs = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('搜索请求失败');
      }

      const searchResults = await response.json();
      setResults(searchResults);
    } catch (error) {
      console.error('搜索出错:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 使用防抖进行搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchDocs(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 处理文档选择
  const handleSelect = (result: SearchResult) => {
    const normalizedSlug = result.slug.replace(/^\/+|\/+$/g, '');
    router.push(`/docs/${normalizedSlug}`);
    setIsOpen(false);
    setQuery('');
  };

  // 处理打开搜索框
  const handleOpenSearch = () => {
    setIsOpen(true);
    // 重置搜索状态
    setQuery('');
    setResults([]);
  };

  // 处理关闭搜索框
  const handleCloseSearch = () => {
    setIsOpen(false);
  };

  // 处理快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 按 K 键打开搜索框
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpenSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      {/* 搜索触发器 */}
      <div className="relative">
        <input
          type="text"
          readOnly
          onClick={handleOpenSearch}
          placeholder="搜索文档..."
          className="w-full pl-8 pr-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-gray-300 focus:outline-none"
        />
        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
        <kbd className="absolute right-2.5 top-2.5 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 rounded">
          ⌘K
        </kbd>
      </div>

      {/* 搜索弹出框 - 使用Portal确保正确渲染 */}
      {mounted && isOpen && createPortal(
        <SearchPopover
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
          }}
          results={results}
          onSelect={handleSelect}
          onClose={handleCloseSearch}
          isLoading={isLoading}
        />,
        document.body
      )}
    </div>
  );
} 