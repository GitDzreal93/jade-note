"use client";

import React, { useMemo, useEffect } from 'react';
import { Viewer } from '@bytemd/react';
import { useTheme } from 'next-themes';
import { plugins, sanitize } from "./config";

// 导入主题样式
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.css';
import 'juejin-markdown-themes/dist/juejin.min.css';
import 'juejin-markdown-themes/dist/github.min.css';

interface BytemdViewerProps {
  body: string;
}

export const BytemdViewer = ({ body }: BytemdViewerProps) => {
  const { theme } = useTheme();
  
  // 根据当前主题加载不同的样式
  const themeClass = useMemo(() => {
    return theme === 'dark' ? 'markdown-body-dark' : 'markdown-body';
  }, [theme]);

  // 添加后处理逻辑修复列表和代码块问题
  useEffect(() => {
    const fixMarkdownRendering = () => {
      // 修复代码块选择区域
      const codeBlocks = document.querySelectorAll('.bytemd-viewer pre');
      codeBlocks.forEach(block => {
        block.classList.add('code-block-wrapper');
      });

      // 确保列表项正确显示
      const lists = document.querySelectorAll('.bytemd-viewer ul, .bytemd-viewer ol');
      lists.forEach(list => {
        if (list.tagName === 'UL') {
          list.classList.add('md-list-disc');
        } else if (list.tagName === 'OL') {
          list.classList.add('md-list-decimal');
        }
      });

      // 修复代码块后内容被当作代码块的问题
      // 检查内容中是否有未正确闭合的代码块
      const viewerElement = document.querySelector('.bytemd-viewer');
      if (viewerElement) {
        // 查找所有不在 pre 标签内的独立 ``` 行 (可能是被错误解析的代码块结束标记)
        const contentDivs = viewerElement.querySelectorAll('.markdown-body > div');
        contentDivs.forEach(div => {
          // 寻找被误解析为段落的代码块结束标记
          if (div.textContent && div.textContent.trim() === '```') {
            // 移除错误解析的结束标记元素
            div.remove();
          }
        });

        // 查找错误包含后续内容的代码块
        const allPres = viewerElement.querySelectorAll('pre code');
        allPres.forEach(codeElement => {
          const codeText = codeElement.textContent || '';
          
          // 检查代码块中是否包含 ``` 结束标记后还有其他标题等内容
          const closeBlockMatch = codeText.match(/```\s*\n(##\s+|###\s+|\*\*|\n\n)/m);
          if (closeBlockMatch && closeBlockMatch.index) {
            // 找到了错误包含的内容，需要分割代码块
            const validCode = codeText.substring(0, closeBlockMatch.index + 3); // 保留 ``` 结束标记
            const remainingContent = codeText.substring(closeBlockMatch.index + 3);
            
            // 更新代码块内容
            codeElement.textContent = validCode;
            
            // 创建新元素显示剩余内容
            if (remainingContent.trim()) {
              const container = document.createElement('div');
              container.className = 'recovered-content';
              container.innerHTML = remainingContent;
              
              // 插入到代码块后面
              const preElement = codeElement.closest('pre');
              if (preElement && preElement.parentNode) {
                preElement.parentNode.insertBefore(container, preElement.nextSibling);
              }
            }
          }
        });
      }
    };

    // 使用 setTimeout 确保在 DOM 渲染完成后执行
    const timer = setTimeout(fixMarkdownRendering, 100);
    return () => clearTimeout(timer);
  }, [body]);

  return (
    <div className={`bytemd-viewer ${themeClass}`}>
      <Viewer value={body} plugins={plugins} sanitize={sanitize} />
    </div>
  );
};
