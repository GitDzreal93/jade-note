'use client';

import React, { useMemo } from 'react';
import { Viewer } from '@bytemd/react';
import { useTheme } from 'next-themes';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
import mermaid from '@bytemd/plugin-mermaid';
import { Icon } from '@iconify/react';
import Link from 'next/link';

// 导入主题样式
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.css';
import 'juejin-markdown-themes/dist/juejin.min.css';
import 'juejin-markdown-themes/dist/github.min.css';

interface BytemdViewerProps {
  content: string;
  className?: string;
}

// 创建自定义插件，支持 Iconify 图标
const iconifyPlugin = () => {
  return {
    viewerEffect({ markdownBody }) {
      // 查找所有 :icon{name="xxx"} 格式的文本
      const iconRegex = /:icon\{name="([^"]+)"\}/g;
      const elements = markdownBody.querySelectorAll('p');
      
      elements.forEach(el => {
        if (!el.textContent) return;
        
        // 替换文本内容中的图标标记
        const html = el.innerHTML.replace(iconRegex, (match, iconName) => {
          return `<span class="inline-flex items-center"><span class="iconify" data-icon="${iconName}"></span></span>`;
        });
        
        if (html !== el.innerHTML) {
          el.innerHTML = html;
          
          // 使用 Iconify 渲染图标
          el.querySelectorAll('.iconify').forEach(iconElement => {
            const iconName = iconElement.getAttribute('data-icon');
            if (iconName) {
              const span = document.createElement('span');
              span.className = 'inline-flex items-center align-middle mx-1';
              iconElement.replaceWith(span);
              
              // 使用 React 渲染 Iconify 图标
              const iconInstance = document.createElement('span');
              iconInstance.className = 'iconify-inline';
              iconInstance.setAttribute('data-icon', iconName);
              span.appendChild(iconInstance);
            }
          });
        }
      });
    }
  };
};

// 创建自定义插件，处理内部链接
const internalLinksPlugin = () => {
  return {
    viewerEffect({ markdownBody }) {
      const links = markdownBody.querySelectorAll('a');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/docs/')) {
          // 为内部文档链接添加样式和事件处理
          link.classList.add('text-emerald-600', 'hover:text-emerald-500');
          
          // 阻止默认行为，使用 Next.js 路由
          link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = href;
          });
        } else if (href && !href.startsWith('/')) {
          // 外部链接
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          link.classList.add('text-emerald-600', 'hover:text-emerald-500');
        }
      });
    }
  };
};

export default function BytemdViewer({ content, className = '' }: BytemdViewerProps) {
  const { theme } = useTheme();
  
  // 根据当前主题加载不同的样式
  const themeClass = useMemo(() => {
    return theme === 'dark' ? 'markdown-body-dark' : 'markdown-body';
  }, [theme]);
  
  // 配置 ByteMD 插件
  const plugins = useMemo(() => [
    gfm(),
    highlight(),
    math(),
    mermaid(),
    iconifyPlugin(),
    internalLinksPlugin()
  ], []);

  return (
    <div className={`bytemd-viewer ${themeClass} ${className}`}>
      <Viewer 
        value={content} 
        plugins={plugins}
      />
    </div>
  );
}
