'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MembershipStatus, 
  ArticlePaywallConfig, 
  PromotionConfig, 
  paywallConfig,
  mockData,
  detectPremiumContent,
  getContentPreview,
  PremiumContentInfo
} from './config';

// 付费墙上下文接口
interface PaywallContextType {
  // 状态
  membershipStatus: MembershipStatus;
  isArticlePremium: boolean;
  currentPromotion: PromotionConfig | null;
  previewContent: string | null;
  fullContent: string | null;
  
  // 方法
  navigateToPricing: (source?: string, couponCode?: string) => void;
  checkIsPremiumContent: (content: string) => boolean;
  setContent: (content: string) => void;
  
  // 配置
  config: typeof paywallConfig;
}

// 创建上下文
const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

// 使用mock数据的环境变量
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

// 付费墙提供者组件
export const PaywallProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  
  // 会员状态
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>({
    isPremium: false
  });
  
  // 当前文章状态
  const [isArticlePremium, setIsArticlePremium] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [fullContent, setFullContent] = useState<string | null>(null);
  
  // 促销信息
  const [currentPromotion, setCurrentPromotion] = useState<PromotionConfig | null>(null);
  
  // 初始化 - 加载会员状态和促销信息
  useEffect(() => {
    const loadMembershipStatus = async () => {
      try {
        if (USE_MOCK_DATA) {
          // 使用模拟数据
          setMembershipStatus(mockData.membershipStatus);
          setCurrentPromotion(mockData.promotionConfig);
        } else {
          // 从API获取会员状态 (未实现)
          // const response = await fetch('/api/membership');
          // const data = await response.json();
          // setMembershipStatus(data);
          
          // 从API获取促销信息 (未实现)
          // const promoResponse = await fetch('/api/promotions/current');
          // const promoData = await promoResponse.json();
          // setCurrentPromotion(promoData);
          
          // 临时使用模拟数据
          setMembershipStatus(mockData.membershipStatus);
          setCurrentPromotion(mockData.promotionConfig);
        }
      } catch (error) {
        console.error('加载会员状态失败:', error);
        // 失败时使用默认状态
        setMembershipStatus({ isPremium: false });
      }
    };
    
    loadMembershipStatus();
  }, []);
  
  // 检查内容是否为付费内容
  const checkIsPremiumContent = (content: string): boolean => {
    const contentInfo = detectPremiumContent(content);
    return contentInfo.isPremium;
  };
  
  // 设置内容
  const setContent = (content: string) => {
    const contentInfo = detectPremiumContent(content);
    setIsArticlePremium(contentInfo.isPremium);
    setFullContent(content);
    
    if (contentInfo.isPremium && !membershipStatus.isPremium) {
      // 非会员查看付费内容，只显示预览
      setPreviewContent(getContentPreview(content, contentInfo));
    } else {
      // 免费内容或会员，显示完整内容
      setPreviewContent(null);
    }
  };
  
  // 跳转到定价页面
  const navigateToPricing = (source?: string, couponCode?: string) => {
    let url = paywallConfig.pricingPageUrl;
    
    // 添加参数
    const params = new URLSearchParams();
    if (source) params.append('source', source);
    if (couponCode) params.append('coupon', couponCode);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    // 使用路由导航
    router.push(url);
  };
  
  // 提供上下文值
  const contextValue: PaywallContextType = {
    membershipStatus,
    isArticlePremium,
    currentPromotion,
    previewContent,
    fullContent,
    navigateToPricing,
    checkIsPremiumContent,
    setContent,
    config: paywallConfig
  };
  
  return (
    <PaywallContext.Provider value={contextValue}>
      {children}
    </PaywallContext.Provider>
  );
};

// 使用付费墙上下文的Hook
export const usePaywall = (): PaywallContextType => {
  const context = useContext(PaywallContext);
  if (context === undefined) {
    throw new Error('usePaywall must be used within a PaywallProvider');
  }
  return context;
};
