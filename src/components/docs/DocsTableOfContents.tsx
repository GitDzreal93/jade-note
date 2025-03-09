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
    // 打印调试信息
    console.log('DocsTableOfContents: 开始获取标题元素');
    
    // 检查所有的标题元素，包括那些没有ID的
    const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3'));
    console.log('DocsTableOfContents: 所有标题元素', {
      total: allHeadings.length,
      h1Count: document.querySelectorAll('h1').length,
      h2Count: document.querySelectorAll('h2').length,
      h3Count: document.querySelectorAll('h3').length,
      allHeadings: allHeadings.map(h => ({
        tagName: h.tagName,
        id: h.id,
        text: h.textContent,
        hasId: !!h.id,
        className: h.className
      }))
    });
    
    // 特别检查 h1 元素
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length > 0) {
      console.log('DocsTableOfContents: 找到 h1 元素', {
        count: h1Elements.length,
        details: Array.from(h1Elements).map(h1 => ({
          id: h1.id,
          text: h1.textContent,
          className: h1.className,
          style: h1.getAttribute('style'),
          computedDisplay: getComputedStyle(h1).display,
          computedVisibility: getComputedStyle(h1).visibility,
          parentNode: h1.parentNode ? {
            tagName: h1.parentNode.nodeName,
            className: (h1.parentNode as HTMLElement).className
          } : null
        }))
      });
    } else {
      console.log('DocsTableOfContents: 没有找到 h1 元素');
      
      // 如果没有找到 h1 元素，尝试查找包含"一级目录"文本的元素
      const allElements = document.querySelectorAll('*');
      const elementsWithText = Array.from(allElements).filter(el => 
        el.textContent && el.textContent.includes('一级目录')
      );
      
      if (elementsWithText.length > 0) {
        console.log('DocsTableOfContents: 找到包含"一级目录"文本的元素', {
          count: elementsWithText.length,
          elements: elementsWithText.map(el => ({
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            textContent: el.textContent
          }))
        });
      }
    }
    
    // 获取所有标题元素 (只获取 h1, h2, h3)
    const elements = Array.from(document.querySelectorAll('h1, h2, h3'))
      .filter(element => element.id) // 只获取有id的标题
      .map(element => ({
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName[1]),
      }));
    
    console.log('DocsTableOfContents: 过滤后的标题元素', elements);
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

    // 添加调试信息
    console.log('DocsTableOfContents: 设置交叉观察器');
    const headingsWithId = Array.from(document.querySelectorAll('h1, h2, h3')).filter(h => h.id);
    console.log(`DocsTableOfContents: 找到 ${headingsWithId.length} 个有ID的标题元素`);
    
    // 如果没有找到有ID的 h1 元素，尝试手动添加一个
    const h1WithId = Array.from(document.querySelectorAll('h1')).filter(h => h.id);
    if (h1WithId.length === 0) {
      console.log('DocsTableOfContents: 没有找到有ID的 h1 元素，尝试手动添加');
      
      // 尝试找到包含"一级目录"文本的 h1 元素
      const h1Elements = Array.from(document.querySelectorAll('h1'));
      const h1WithText = h1Elements.find(h => h.textContent?.includes('一级目录'));
      
      if (h1WithText) {
        console.log('DocsTableOfContents: 找到包含"一级目录"文本的 h1 元素，添加ID');
        h1WithText.id = 'heading-一级目录';
        observer.observe(h1WithText);
        
        // 更新标题列表
        setHeadings(prev => [
          {
            id: 'heading-一级目录',
            text: '一级目录',
            level: 1
          },
          ...prev
        ]);
      }
    }
    
    document.querySelectorAll('h1, h2, h3').forEach((heading) => {
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
    <nav className="h-full">
      <div className="bg-white rounded-lg border border-gray-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-3 border-b border-gray-100">本页目录</h3>
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
