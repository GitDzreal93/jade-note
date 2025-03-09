"use client";

import React, { useMemo, useEffect, useState } from 'react';
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
  const [processedContent, setProcessedContent] = useState(body);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // 根据当前主题加载不同的样式
  const themeClass = useMemo(() => {
    return theme === 'dark' ? 'markdown-body-dark' : 'markdown-body';
  }, [theme]);

  // 预处理内容，修复常见的 Markdown 渲染问题
  useEffect(() => {
    try {
      console.log('BytemdViewer: 处理内容前', {
        contentLength: body.length,
        contentStart: body.substring(0, 100),
        contentEnd: body.substring(body.length - 100)
      });

      // 修复嵌套代码块问题
      let processed = body
        // 确保代码块的语言标记正确
        .replace(/```(\s*)(\n|\r\n)/g, '```text$2')
        // 修复可能的嵌套代码块问题
        .replace(/```([a-z]+)([\s\S]*?)```([\s\S]*?)```/g, (match, lang, code, rest) => {
          // 检查是否有嵌套的代码块
          if (rest.includes('```')) {
            // 将嵌套的代码块中的 ``` 替换为特殊标记
            const fixedCode = code.replace(/```/g, '\\```');
            return `\`\`\`${lang}${fixedCode}\`\`\`${rest}`;
          }
          return match;
        })
        // 确保代码块和标题之间有空行
        .replace(/```\s*\n(#+ )/g, '```\n\n$1')
        // 统一换行符
        .replace(/\r\n/g, '\n');

      console.log('BytemdViewer: 处理内容后', {
        originalLength: body.length,
        processedLength: processed.length,
        changed: body !== processed
      });

      setProcessedContent(processed);
      setRenderError(null);
    } catch (error) {
      console.error('BytemdViewer: 内容预处理错误', error);
      setRenderError(error instanceof Error ? error.message : String(error));
      // 如果预处理失败，使用原始内容
      setProcessedContent(body);
    }
  }, [body]);

  // 添加后处理逻辑修复列表和代码块问题
  useEffect(() => {
    const fixMarkdownRendering = () => {
      try {
        console.log('BytemdViewer: 开始修复渲染问题');
        
        // 修复代码块选择区域
        const codeBlocks = document.querySelectorAll('.bytemd-viewer pre');
        console.log(`BytemdViewer: 找到 ${codeBlocks.length} 个代码块`);
        codeBlocks.forEach(block => {
          block.classList.add('code-block-wrapper');
        });

        // 确保列表项正确显示
        const lists = document.querySelectorAll('.bytemd-viewer ul, .bytemd-viewer ol');
        console.log(`BytemdViewer: 找到 ${lists.length} 个列表`);
        lists.forEach(list => {
          if (list.tagName === 'UL') {
            list.classList.add('md-list-disc');
          } else if (list.tagName === 'OL') {
            list.classList.add('md-list-decimal');
          }
        });

        // 修复代码块后内容被当作代码块的问题
        const viewerElement = document.querySelector('.bytemd-viewer');
        if (viewerElement) {
          // 查找所有不在 pre 标签内的独立 ``` 行 (可能是被错误解析的代码块结束标记)
          const contentDivs = viewerElement.querySelectorAll('.markdown-body > div');
          console.log(`BytemdViewer: 检查 ${contentDivs.length} 个内容块`);
          
          contentDivs.forEach(div => {
            // 寻找被误解析为段落的代码块结束标记
            if (div.textContent && div.textContent.trim() === '```') {
              console.log('BytemdViewer: 移除错误解析的代码块结束标记');
              div.remove();
            }
          });

          // 查找错误包含后续内容的代码块
          const allPres = viewerElement.querySelectorAll('pre code');
          console.log(`BytemdViewer: 检查 ${allPres.length} 个代码元素`);
          
          allPres.forEach(codeElement => {
            const codeText = codeElement.textContent || '';
            
            // 检查代码块中是否包含 ``` 结束标记后还有其他标题等内容
            const closeBlockMatch = codeText.match(/```\s*\n(##\s+|###\s+|\*\*|\n\n)/m);
            if (closeBlockMatch && closeBlockMatch.index) {
              console.log('BytemdViewer: 修复代码块内容混合问题');
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
        
        console.log('BytemdViewer: 渲染修复完成');
      } catch (error) {
        console.error('BytemdViewer: 渲染修复错误', error);
      }
    };

    // 使用 setTimeout 确保在 DOM 渲染完成后执行
    const timer = setTimeout(fixMarkdownRendering, 200);
    return () => clearTimeout(timer);
  }, [processedContent]);

  if (renderError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <h3 className="text-red-600 font-medium">渲染错误</h3>
        <p className="text-red-500 mt-2">{renderError}</p>
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm overflow-auto">
          {body.substring(0, 500)}...
        </pre>
      </div>
    );
  }

  return (
    <div className={`bytemd-viewer ${themeClass}`}>
      <Viewer 
        value={processedContent} 
        plugins={plugins} 
        sanitize={sanitize} 
      />
    </div>
  );
};
