import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchResult {
  title: string;
  slug: string;
  parentTitle?: string;
  preview?: string;
  isParent?: boolean;
}

interface SearchPopoverProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function SearchPopover({
  query,
  onQueryChange,
  results,
  onSelect,
  onClose,
  isLoading,
}: SearchPopoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // 处理ESC键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 搜索输入框 */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="输入关键词搜索..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500"
              />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 搜索结果 */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : results.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {results.map((result, index) => (
                  <li key={result.slug + index}>
                    <button
                      onClick={() => onSelect(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {result.title}
                          </span>
                          {result.isParent ? (
                            <span className="px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded">
                              主文档
                            </span>
                          ) : null}
                        </div>
                        {result.parentTitle && (
                          <div className="text-xs text-gray-500">
                            {result.parentTitle}
                          </div>
                        )}
                        {result.preview && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            <span className="text-emerald-600 font-medium">找到：</span>
                            {result.preview}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              query && (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  未找到相关文档
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 