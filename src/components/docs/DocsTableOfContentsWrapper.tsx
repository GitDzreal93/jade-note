'use client';

import React from 'react';
import DocsTableOfContents from './DocsTableOfContents';
import { SidebarPromotion } from '../paywall';

/**
 * 文档目录包装组件
 * 在目录上方显示促销信息（如果适用）
 */
export default function DocsTableOfContentsWrapper() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 侧边栏促销组件 */}
      <SidebarPromotion source="toc_sidebar" />
      
      {/* 原始文档目录组件 */}
      <DocsTableOfContents />
    </div>
  );
}
