'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function DocsTableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    // 获取所有标题元素
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(element => element.id) // 只获取有id的标题
      .map(element => ({
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName[1]),
      }));
    setHeadings(elements);

    // 监听滚动事件来更新活动标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px'
      }
    );

    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // 考虑固定导航栏的高度
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-4 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 mb-4">本页目录</h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{
                paddingLeft: `${(heading.level - 1) * 12}px`
              }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={clsx(
                  'text-sm hover:text-emerald-600 transition-colors duration-200',
                  'block w-full text-left py-1',
                  activeId === heading.id
                    ? 'text-emerald-600 font-medium'
                    : 'text-gray-600'
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
