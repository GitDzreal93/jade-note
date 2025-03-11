'use client';

import React, { useState, useEffect } from 'react';
import { usePaywall } from './context';
import { ArticlePaywall } from './ArticlePaywall';

interface PaywallPreviewProps {
  content: string;
  children: React.ReactNode;
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
    membershipStatus, 
    isArticlePremium,
    checkIsPremiumContent,
    setContent,
    previewContent,
    config
  } = usePaywall();
  
  const [initialized, setInitialized] = useState(false);
  
  // 初始化内容
  useEffect(() => {
    if (!initialized && content) {
      setContent(content);
      setInitialized(true);
    }
  }, [content, initialized, setContent]);
  
  // 非付费内容或会员用户，直接显示全部内容
  if (!isArticlePremium || membershipStatus.isPremium) {
    return <>{children}</>;
  }
  
  // 付费内容且非会员，显示预览内容和付费墙
  return (
    <div className="relative">
      {/* 预览内容区域 */}
      <div>
        {children}
      </div>
      
      {/* 模糊遮罩层 - 在预览内容上方添加渐变效果 */}
      <div 
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: `${config.preview.gradientHeightPx}px`,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
          pointerEvents: 'none',
        }}
      />
      
      {/* 付费墙组件 */}
      <ArticlePaywall source="article_preview" />
    </div>
  );
};
