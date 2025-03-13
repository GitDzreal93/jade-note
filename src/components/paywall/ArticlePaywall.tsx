'use client';

import React from 'react';
import { usePaywall } from './context';
import { useSubscription } from '@/hooks/useSubscription';

interface ArticlePaywallProps {
  source?: string;
}

/**
 * 文章底部付费墙组件
 * 显示在文章预览内容底部，提示用户升级会员
 */
export const ArticlePaywall: React.FC<ArticlePaywallProps> = ({ 
  source = 'article'
}) => {
  const { 
    currentPromotion, 
    navigateToPricing,
    config 
  } = usePaywall();
  
  const { subscription } = useSubscription();
  
  // 如果是订阅用户，不显示付费墙
  if (subscription) {
    return null;
  }
  
  // 获取文案配置
  const { title, description, buttonText } = config.articlePaywall;
  
  // 处理导航
  const handleClick = () => {
    navigateToPricing(
      source, 
      currentPromotion?.couponCode
    );
  };
  
  // 格式化折扣文本
  const formattedDiscountText = currentPromotion 
    ? config.sidebarPromotion.discountText.replace(
        '{discount}', 
        currentPromotion.discountPercentage.toString()
      )
    : '';
  
  return (
    <div className="w-full mt-8 mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      {/* 渐变顶部 */}
      <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
      
      <div className="p-6">
        {/* 主标题 */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        {/* 描述文本 */}
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        
        {/* 促销信息 (如果有) */}
        {currentPromotion && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300">
                  {currentPromotion.title}
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {currentPromotion.description}
                </p>
              </div>
              
              {currentPromotion.discountPercentage > 0 && (
                <div className="flex-shrink-0 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {formattedDiscountText}
                </div>
              )}
            </div>
            
            {/* 倒计时显示 (如果有结束日期) */}
            {currentPromotion.endDate && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                优惠截止日期: {new Date(currentPromotion.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
        
        {/* 按钮区域 */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
