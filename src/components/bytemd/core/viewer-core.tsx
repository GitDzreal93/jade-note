"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { Viewer } from '@bytemd/react';
import { useTheme } from 'next-themes';
import { plugins, sanitize } from "../config";

// 导入主题样式
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.css';
import 'juejin-markdown-themes/dist/juejin.min.css';
import 'juejin-markdown-themes/dist/github.min.css';

// 导入自定义工具和样式
import { customStyles } from '../styles/theme';
import { preprocessMarkdown } from '../utils/content-formatter';
import { enhanceMarkdownRendering } from '../utils/dom-enhancer';
import { analyzeHeadingStructure, optimizeHeadingDisplay } from '../utils/heading-manager';

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

  // 预处理内容，优化Markdown渲染效果
  useEffect(() => {
    try {
      // 使用内容格式化工具处理内容
      const processed = preprocessMarkdown(body);
      setProcessedContent(processed);
      setRenderError(null);
    } catch (error) {
      console.error('BytemdViewer: 内容预处理错误', error);
      setRenderError(error instanceof Error ? error.message : String(error));
      // 如果预处理失败，使用原始内容
      setProcessedContent(body);
    }
  }, [body]);

  // 增强DOM渲染效果
  useEffect(() => {
    // 使用 setTimeout 确保在 DOM 渲染完成后执行
    const timer = setTimeout(enhanceMarkdownRendering, 200);
    return () => clearTimeout(timer);
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