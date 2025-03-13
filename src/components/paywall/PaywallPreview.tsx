'use client';

import React, { useState, useEffect } from 'react';
import { usePaywall } from './context';
import { ArticlePaywall } from './ArticlePaywall';
import { Viewer } from '@bytemd/react';
import { plugins, sanitize } from '../bytemd/config';
import { getMarkdownClassName } from '../bytemd/styles/markdown';
import { useSubscription } from '@/hooks/useSubscription';

interface PaywallPreviewProps {
  content: string;
  children?: React.ReactNode;
}

/**
 * 付费墙预览控制组件
 * 用于控制文章内容的显示方式
 * - 普通用户：只显示部分内容并在底部显示付费墙
 * - 会员用户：显示全部内容
 */
export const PaywallPreview: React.FC<PaywallPreviewProps> = ({
  content,
  children
}) => {
  const { 
    isArticlePremium,
    checkIsPremiumContent,
    setContent,
    previewContent,
    fullContent,
    config
  } = usePaywall();
  
  const { subscription } = useSubscription();
  const [initialized, setInitialized] = useState(false);
  
  // 初始化内容
  useEffect(() => {
    if (!initialized && content) {
      setContent(content);
      setInitialized(true);
    }
  }, [content, initialized, setContent]);
  
  // 非付费内容或订阅用户，显示完整内容
  if (!isArticlePremium || subscription) {
    return (
      <div className={getMarkdownClassName()}>
        <Viewer 
          value={content} 
          plugins={plugins} 
          sanitize={sanitize}
        />
      </div>
    );
  }
  
  // 直接使用预览内容作为显示内容
  const contentToShow = previewContent || '';
  
  // 付费内容且非会员，只显示预览内容和付费墙
  return (
    <div className="relative">
      {/* 预览内容区域 - 只显示预览部分 */}
      <div className="preview-content relative">
        {/* 直接渲染预览内容 */}
        <div className={getMarkdownClassName()}>
          <Viewer 
            value={contentToShow} 
            plugins={plugins} 
            sanitize={sanitize}
          />
        </div>
        
        {/* 模糊遮罩层 - 在预览内容底部添加渐变效果 */}
        <div 
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: `${config.preview.gradientHeightPx}px`,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      </div>
      
      {/* 付费墙组件 */}
      <div className="mt-4">
        <ArticlePaywall source="article_preview" />
      </div>
    </div>
  );
};
