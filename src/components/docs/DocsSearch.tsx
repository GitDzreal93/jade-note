'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DocNode } from '@/lib/docs';
import { Search } from 'lucide-react';

interface DocsSearchProps {
  docs: DocNode[];
}

interface SearchResult {
  title: string;
  slug: string;
  parentTitle?: string;
}

export function DocsSearch({ docs }: DocsSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 扁平化文档树，包括子文档
  const flattenDocs = (docs: DocNode[]): SearchResult[] => {
    return docs.reduce<SearchResult[]>((acc, doc) => {
      // 添加当前文档
      acc.push({
        title: doc.title,
        slug: doc.slug,
      });

      // 添加子文档，并包含父文档标题
      if (doc.children?.length) {
        doc.children.forEach(child => {
          acc.push({
            title: child.title,
            slug: child.slug,
            parentTitle: doc.title,
          });
        });
      }

      return acc;
    }, []);
  };

  // 搜索文档
  const searchDocs = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const allDocs = flattenDocs(docs);
    const searchResults = allDocs.filter(doc => {
      const normalizedQuery = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(normalizedQuery) ||
        doc.parentTitle?.toLowerCase().includes(normalizedQuery)
      );
    });

    setResults(searchResults);
  };

  // 处理文档选择
  const handleSelect = (result: SearchResult) => {
    const normalizedSlug = result.slug.replace(/^\/+|\/+$/g, '');
    router.push(`/docs/${normalizedSlug}`);
    setIsOpen(false);
    setQuery('');
  };

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 按 K 键打开搜索框
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // 按 Esc 键关闭搜索框
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full">
      {/* 搜索触发器 */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-white border rounded-lg hover:border-gray-300 focus:outline-none"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">搜索文档...</span>
        <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
          ⌘K
        </kbd>
      </button>

      {/* 搜索弹出框 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                searchDocs(e.target.value);
              }}
              placeholder="输入关键词搜索..."
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          {results.length > 0 && (
            <ul className="max-h-64 overflow-y-auto border-t border-gray-100">
              {results.map((result, index) => (
                <li key={result.slug + index}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {result.title}
                    </div>
                    {result.parentTitle && (
                      <div className="text-xs text-gray-500">
                        {result.parentTitle}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              未找到相关文档
            </div>
          )}
        </div>
      )}
    </div>
  );
} 