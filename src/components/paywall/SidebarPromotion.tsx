'use client';

import React from 'react';
import { usePaywall } from './context';
import { useSubscription } from '@/hooks/useSubscription';

interface SidebarPromotionProps {
  source?: string;
}

/**
 * 侧边栏促销组件
 * 显示在右侧目录上方，提供付费入口和促销信息
 */
export const SidebarPromotion: React.FC<SidebarPromotionProps> = ({
  source = 'sidebar'
}) => {
  const { 
    currentPromotion, 
    navigateToPricing, 
    config 
  } = usePaywall();
  
  const { subscription } = useSubscription();
  
  // 如果用户是订阅用户，不显示促销组件
  if (subscription) {
    return null;
  }
  
  // 如果没有促销信息，使用默认文案
  const title = currentPromotion?.title || config.sidebarPromotion.title;
  const description = currentPromotion?.description || config.sidebarPromotion.description;
  const buttonText = currentPromotion?.buttonText || config.sidebarPromotion.buttonText;
  
  // 处理导航
  const handleClick = () => {
    navigateToPricing(
      source, 
      currentPromotion?.couponCode
    );
  };
  
  // 格式化折扣文本
  const discount = currentPromotion?.discountPercentage;
  const discountText = discount 
    ? config.sidebarPromotion.discountText.replace('{discount}', discount.toString()) 
    : '';
  
  return (
    <div className="w-full mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-4">
        {/* 主标题和描述 */}
        <div className="mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {description}
          </p>
        </div>
        
        {/* 折扣信息 */}
        {discount && discount > 0 && (
          <div className="mb-3">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded">
              {discountText}
            </span>
          </div>
        )}
        
        {/* 按钮 */}
        <button
          onClick={handleClick}
          className="w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
