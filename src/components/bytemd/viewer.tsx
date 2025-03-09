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

// 自定义样式
const customStyles = `
  /* 代码块样式 */
  .bytemd-viewer pre, .markdown-body pre {
    background-color: #f8f9fa !important;
    border-radius: 8px !important;
    padding: 16px !important;
    margin: 1em 0 !important;
    overflow: auto !important;
    position: relative !important;
    border: 1px solid #e9ecef !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
  }
  
  .bytemd-viewer pre code, .markdown-body pre code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #24292e !important;
    background: none !important;
    border: none !important;
    padding: 0 !important;
    white-space: pre !important;
    tab-size: 2 !important;
    display: block !important;
  }
  
  /* 代码块语言标记 */
  .bytemd-viewer pre::before, .markdown-body pre::before {
    content: attr(data-lang);
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    color: #6e7781;
    background: #f0f1f2;
    border-bottom-left-radius: 4px;
    border-top-right-radius: 8px;
    pointer-events: none;
  }
  
  /* 暗色模式代码块 */
  .markdown-body-dark pre {
    background-color: #1e1e1e !important;
    border-color: #2d2d2d !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
  }
  
  .markdown-body-dark pre code {
    color: #e6e6e6 !important;
  }
  
  .markdown-body-dark pre::before {
    background: #2d2d2d;
    color: #a0a0a0;
  }
  
  /* 行内代码 */
  .bytemd-viewer code:not(pre code), .markdown-body code:not(pre code) {
    background-color: rgba(175, 184, 193, 0.2) !important;
    border-radius: 4px !important;
    padding: 0.2em 0.4em !important;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
    font-size: 85% !important;
  }
  
  .markdown-body-dark code:not(pre code) {
    background-color: rgba(110, 118, 129, 0.4) !important;
  }
  
  /* 语法高亮颜色 */
  .bytemd-viewer pre.language-js .token.keyword,
  .markdown-body pre.language-js .token.keyword {
    color: #cf222e !important;
  }
  
  .bytemd-viewer pre.language-js .token.string,
  .markdown-body pre.language-js .token.string {
    color: #0a3069 !important;
  }
  
  .bytemd-viewer pre.language-js .token.comment,
  .markdown-body pre.language-js .token.comment {
    color: #6e7781 !important;
    font-style: italic !important;
  }
  
  .bytemd-viewer pre.language-js .token.function,
  .markdown-body pre.language-js .token.function {
    color: #8250df !important;
  }
  
  /* 暗色模式语法高亮 */
  .markdown-body-dark pre.language-js .token.keyword {
    color: #ff7b72 !important;
  }
  
  .markdown-body-dark pre.language-js .token.string {
    color: #a5d6ff !important;
  }
  
  .markdown-body-dark pre.language-js .token.comment {
    color: #8b949e !important;
  }
  
  .markdown-body-dark pre.language-js .token.function {
    color: #d2a8ff !important;
  }

  /* 列表样式 */
  /* 基本列表样式 */
  .bytemd-viewer ul, .markdown-body ul {
    list-style-type: disc !important;
    padding-left: 2em !important;
    margin: 1em 0 !important;
  }
  
  .bytemd-viewer ol, .markdown-body ol {
    list-style-type: decimal !important;
    padding-left: 2em !important;
    margin: 1em 0 !important;
  }
  
  .bytemd-viewer ul li, .bytemd-viewer ol li,
  .markdown-body ul li, .markdown-body ol li {
    display: list-item !important;
    margin: 0.5em 0 !important;
    position: relative !important;
    list-style-position: outside !important;
  }
  
  /* 定制列表标记 */
  .bytemd-viewer ul li::marker, .markdown-body ul li::marker {
    color: currentColor !important;
    display: inline-block !important;
  }
  
  .bytemd-viewer ol li::marker, .markdown-body ol li::marker {
    color: currentColor !important;
    display: inline-block !important;
  }
  
  /* 嵌套列表样式 */
  .bytemd-viewer ul ul, .bytemd-viewer ol ul,
  .markdown-body ul ul, .markdown-body ol ul {
    list-style-type: circle !important;
  }
  
  .bytemd-viewer ul ul ul, .bytemd-viewer ol ul ul,
  .markdown-body ul ul ul, .markdown-body ol ul ul {
    list-style-type: square !important;
  }
  
  /* 移除自定义类的列表样式，防止重复显示 */
  .bytemd-viewer ul.md-list-disc li::before, 
  .markdown-body ul.md-list-disc li::before,
  .bytemd-viewer ol.md-list-decimal li::before, 
  .markdown-body ol.md-list-decimal li::before {
    content: none !important;
  }
  
  /* 链接样式 */
  .bytemd-viewer a, .markdown-body a {
    color: #0969da !important;
    text-decoration: none !important;
    transition: color 0.2s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
  }
  
  .bytemd-viewer a:hover, .markdown-body a:hover {
    color: #0550ae !important;
    text-decoration: underline !important;
  }
  
  /* 链接图标样式 */
  .bytemd-viewer a svg, .markdown-body a svg {
    display: inline-block !important;
    vertical-align: middle !important;
    margin-right: 0.25rem !important;
    flex-shrink: 0 !important;
  }
  
  /* 修复链接内容换行问题 */
  .bytemd-viewer a *, .markdown-body a * {
    display: inline-block !important;
    white-space: nowrap !important;
  }
  
  /* 链接标题样式 - 修复链接标题分行问题 */
  .bytemd-viewer h1 a, .bytemd-viewer h2 a, .bytemd-viewer h3 a,
  .markdown-body h1 a, .markdown-body h2 a, .markdown-body h3 a {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    width: auto !important;
  }
  
  /* 暗色模式链接样式 */
  .markdown-body-dark a {
    color: #58a6ff !important;
  }
  
  .markdown-body-dark a:hover {
    color: #79b8ff !important;
  }
`;

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
        .replace(/\r\n/g, '\n')
        // 确保列表项前有空行，这样可以确保列表被正确渲染
        .replace(/(^|\n)(?!\n)([\*\-\+]\s|\d+\.\s)/gm, '$1\n$2')
        // 确保列表项有正确的缩进和空格
        .replace(/(^|\n)([\*\-\+])(?!\s)/gm, '$1$2 ')
        .replace(/(^|\n)(\d+\.)(?!\s)/gm, '$1$2 ');

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
        
        // 修复代码块样式和添加语言标记
        const codeBlocks = document.querySelectorAll('.bytemd-viewer pre');
        console.log(`BytemdViewer: 找到 ${codeBlocks.length} 个代码块`);
        codeBlocks.forEach(block => {
          // 添加样式类
          block.classList.add('code-block-wrapper');
          
          // 获取语言类型
          const codeElement = block.querySelector('code');
          if (codeElement) {
            const classNames = codeElement.className.split(' ');
            let language = 'text';
            
            // 从类名中提取语言类型
            for (const className of classNames) {
              if (className.startsWith('language-')) {
                language = className.replace('language-', '');
                break;
              }
            }
            
            // 设置语言标记
            block.setAttribute('data-lang', language);
            
            // 添加颜色和样式
            (block as HTMLElement).style.position = 'relative';
            
            // 如果是特定语言，添加颜色样式
            if (['js', 'javascript', 'typescript', 'ts'].includes(language)) {
              block.classList.add('language-js');
            } else if (['python', 'py'].includes(language)) {
              block.classList.add('language-python');
            } else if (['bash', 'sh', 'shell', 'zsh'].includes(language)) {
              block.classList.add('language-shell');
            } else if (['html', 'xml'].includes(language)) {
              block.classList.add('language-html');
            } else if (['css', 'scss', 'sass', 'less'].includes(language)) {
              block.classList.add('language-css');
            } else {
              block.classList.add(`language-${language}`);
            }
          }
        });

        // 确保列表项正确显示
        const lists = document.querySelectorAll('.bytemd-viewer ul, .bytemd-viewer ol');
        console.log(`BytemdViewer: 找到 ${lists.length} 个列表`);
        // 不再添加自定义类，避免重复显示列表标记
        lists.forEach(list => {
          // 检查列表是否有正确的列表样式
          const listItems = list.querySelectorAll('li');
          listItems.forEach(item => {
            // 确保列表项有正确的显示样式
            (item as HTMLElement).style.display = 'list-item';
          });
        });
        
        // 修复链接样式，确保链接图标和文本在同一行
        const links = document.querySelectorAll('.bytemd-viewer a');
        console.log(`BytemdViewer: 找到 ${links.length} 个链接`);
        links.forEach(link => {
          // 确保链接使用正确的显示方式
          (link as HTMLElement).style.display = 'inline-flex';
          (link as HTMLElement).style.alignItems = 'center';
          
          // 如果链接内有SVG图标，确保其正确显示
          const svg = link.querySelector('svg');
          if (svg) {
            // 正确处理SVG元素
            const svgElement = svg as unknown as SVGElement;
            svgElement.style.display = 'inline-block';
            svgElement.style.verticalAlign = 'middle';
            svgElement.style.marginRight = '0.25rem';
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
      {/* 添加自定义样式 */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <Viewer 
        value={processedContent} 
        plugins={plugins} 
        sanitize={sanitize} 
      />
    </div>
  );
};
