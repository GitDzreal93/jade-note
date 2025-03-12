"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { Viewer } from '@bytemd/react';
import { useTheme } from 'next-themes';
import { plugins, sanitize } from "../config";

// 基础样式
import 'bytemd/dist/index.css';
// 数学公式样式
import 'katex/dist/katex.css';
// 代码高亮样式
import 'highlight.js/styles/github.css';
// 主题样式 - 只保留一个主题，避免冲突
import 'juejin-markdown-themes/dist/github.min.css';

// 导入自定义工具和样式
import { customStyles } from '../styles/theme';
import { preprocessMarkdown } from '../utils/content-formatter';
import { enhanceMarkdownRendering } from '../utils/dom-enhancer';
import { analyzeHeadingStructure, optimizeHeadingDisplay } from '../utils/heading-manager';
import { PaywallProvider } from "../../paywall/context";
import { detectPremiumContent } from "../../paywall/config";
import { PaywallPreview } from "../../paywall/PaywallPreview";
import { ArticlePaywall } from '../../paywall';
import { getMarkdownClassName } from '../styles/markdown';

// 语言显示名称映射
const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  typescript: 'ts',
  javascript: 'js',
  jsx: 'jsx',
  tsx: 'tsx',
  python: 'py',
  markdown: 'md',
  plaintext: 'text',
  text: 'text',
  shell: 'sh',
  bash: 'sh',
  mdx: 'mdx',
};

interface BytemdViewerProps {
  body: string;
  showPaywall?: boolean;  // 是否显示付费墙
  className?: string;  // 添加 className 参数
}

export const BytemdViewer = ({ 
  body, 
  showPaywall = true,
  className = ''
}: BytemdViewerProps) => {
  const { theme } = useTheme();
  const [processedContent, setProcessedContent] = useState(body);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isPremiumContent, setIsPremiumContent] = useState(false);
  
  // 根据当前主题加载不同的样式
  const themeClass = useMemo(() => {
    return theme === 'dark' ? 'markdown-body-dark' : 'markdown-body';
  }, [theme]);

  // 预处理内容，优化Markdown渲染效果
  useEffect(() => {
    try {
      // 检测是否为付费内容
      const contentInfo = detectPremiumContent(body);
      setIsPremiumContent(contentInfo.isPremium);
      
      // 添加调试日志：输出原始内容的结构
      console.log('Debug: 内容处理开始:', {
        contentLength: body.length,
        firstLine: body.split('\n')[0],
        hasMarkdownHeadings: body.match(/^#+\s/gm)?.length || 0,
        hasHtmlHeadings: body.match(/<h[1-6]/g)?.length || 0
      });
      
      // 移除frontmatter (如果存在)
      let contentToProcess = body;
      const frontmatterMatch = body.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
      
      // 添加调试日志：frontmatter 解析结果
      console.log('Debug: frontmatter 解析:', {
        hasFrontmatter: !!frontmatterMatch,
        frontmatterContent: frontmatterMatch ? frontmatterMatch[1] : null,
        remainingContentStart: frontmatterMatch 
          ? body.substring(frontmatterMatch[0].length, frontmatterMatch[0].length + 100) 
          : body.substring(0, 100)
      });
      
      if (frontmatterMatch) {
        contentToProcess = body.replace(frontmatterMatch[0], '');
        // 添加调试日志：移除 frontmatter 后的内容结构
        console.log('Debug: 移除 frontmatter 后的内容结构:', {
          contentLength: contentToProcess.length,
          firstLine: contentToProcess.split('\n')[0],
          hasMarkdownHeadings: contentToProcess.match(/^#+\s/gm)?.length || 0,
          hasHtmlHeadings: contentToProcess.match(/<h[1-6]/g)?.length || 0
        });
      }
      
      // 使用内容格式化工具处理内容
      const processed = preprocessMarkdown(contentToProcess);
      
      // 添加调试日志：处理后的内容结构
      console.log('Debug: 最终处理后的内容结构:', {
        contentLength: processed.length,
        firstLine: processed.split('\n')[0],
        hasMarkdownHeadings: processed.match(/^#+\s/gm)?.length || 0,
        hasHtmlHeadings: processed.match(/<h[1-6]/g)?.length || 0,
        headingStructure: processed.match(/^#+\s.*$/gm),
        htmlStructure: processed.match(/<h[1-6].*?<\/h[1-6]>/g)
      });
      
      setProcessedContent(processed);
      setRenderError(null);

      // 调试日志：检查代码块
      const codeBlocks = processed.match(/```(\w+)?\n[\s\S]+?```/g);
      if (codeBlocks) {
        codeBlocks.forEach((block, index) => {
          const lang = block.match(/```(\w+)?/)?.[1] || 'text';
          console.log(`Debug: Markdown代码块 ${index + 1}`, {
            language: lang,
            displayName: LANGUAGE_DISPLAY_NAMES[lang] || lang,
            content: block.slice(3 + lang.length, -3).trim()
          });
        });
      }
    } catch (error) {
      console.error('BytemdViewer: 内容预处理错误', error);
      setRenderError(error instanceof Error ? error.message : String(error));
      setProcessedContent(body);
    }
  }, [body]);

  // 增强DOM渲染效果
  useEffect(() => {
    const enhanceCodeBlocks = () => {
      const codeBlocks = document.querySelectorAll('pre code');
      console.log('Debug: 找到的代码块数量:', codeBlocks.length);

      codeBlocks.forEach((block, index) => {
        const parent = block.parentElement;
        if (!parent) {
          console.warn(`Debug: 代码块 ${index + 1} 没有父元素`);
          return;
        }

        // 获取完整的类名
        const fullClassName = block.className;
        console.log(`Debug: 代码块 ${index + 1} 原始类名:`, fullClassName);

        // 提取语言标识
        const langMatch = fullClassName.match(/language-(\w+)/);
        const lang = langMatch ? langMatch[1] : '';
        console.log(`Debug: 代码块 ${index + 1} 提取的语言:`, lang);

        // 获取简化的显示名称
        const displayName = LANGUAGE_DISPLAY_NAMES[lang] || lang;
        console.log(`Debug: 代码块 ${index + 1} 显示名称:`, displayName);

        // 移除旧的语言标记
        const oldLang = parent.getAttribute('data-lang');
        if (oldLang) {
          console.log(`Debug: 代码块 ${index + 1} 移除旧语言标记:`, oldLang);
        }

        // 设置新的语言标记
        if (displayName && displayName !== 'text') {
          parent.setAttribute('data-lang', displayName);
          console.log(`Debug: 代码块 ${index + 1} 设置新语言标记:`, displayName);
        }

        // 确保代码块有正确的类名
        if (!block.className.includes('hljs')) {
          const newClassName = `hljs ${block.className}`;
          block.className = newClassName;
          console.log(`Debug: 代码块 ${index + 1} 更新后的类名:`, newClassName);
        }

        // 检查最终状态
        console.log(`Debug: 代码块 ${index + 1} 最终状态:`, {
          parentElement: parent.tagName,
          dataLang: parent.getAttribute('data-lang'),
          finalClassName: block.className,
          content: block.textContent?.slice(0, 50) + '...'
        });
      });
    };

    // 使用多个时间点来确保代码块被正确处理
    const timers = [100, 300, 500, 1000].map(delay => 
      setTimeout(() => {
        console.log(`Debug: 执行增强处理 (${delay}ms)`);
        enhanceMarkdownRendering();
        enhanceCodeBlocks();
      }, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, [processedContent]);

  // 优化标题显示
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 调试日志：输出处理前的内容
    console.log('Debug: 原始内容分析', {
      processedContent,
      bodyLength: body.length,
      processedLength: processedContent.length,
      hasH1Tag: processedContent.includes('<h1'),
      hasH1Markdown: processedContent.includes('# '),
      firstFewChars: processedContent.substring(0, 200)
    });
    
    // 分析文档结构
    const timer1 = setTimeout(analyzeHeadingStructure, 100);
    const timer2 = setTimeout(analyzeHeadingStructure, 500);
    const timer3 = setTimeout(analyzeHeadingStructure, 1000);
    
    // 优化标题显示
    const timer = setTimeout(optimizeHeadingDisplay, 300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [processedContent, body]);

  // 渲染错误处理
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

  // 渲染完整内容
  const renderFullContent = () => {
    const combinedClassName = getMarkdownClassName(`${themeClass} ${className}`);
    console.log('Debug: 应用的样式类:', {
      themeClass,
      className,
      combinedClassName
    });
    
    return (
      <div className={combinedClassName}>
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

  // 包装付费墙
  return (
    <PaywallProvider>
      {showPaywall && isPremiumContent ? (
        <div className="relative">
          <PaywallPreview content={body} />
        </div>
      ) : (
        renderFullContent()
      )}
    </PaywallProvider>
  );
};