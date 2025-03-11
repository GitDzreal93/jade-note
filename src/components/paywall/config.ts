/**
 * 付费墙配置文件
 * 提供付费墙相关的文案和设置项
 */

export interface MembershipStatus {
  isPremium: boolean;       // 是否是会员
  expiresAt?: string;       // 会员过期时间
  memberSince?: string;     // 成为会员的时间
}

export interface ArticlePaywallConfig {
  isPremiumContent: boolean;  // 是否是付费内容
  previewPercentage: number;  // 免费预览的百分比（如 30% 内容免费）
  price?: number;             // 单独购买此文章的价格
}

export interface PromotionConfig {
  title: string;              // 促销标题
  description: string;        // 促销描述
  buttonText: string;         // 按钮文字
  discountPercentage: number; // 折扣百分比
  endDate?: string;           // 促销结束日期
  couponCode?: string;        // 优惠码
  pricingPageUrl: string;     // 定价页面URL
}

/**
 * 付费内容信息接口
 */
export interface PremiumContentInfo {
  isPremium: boolean;
  previewPercentage?: number;
}

/**
 * 默认付费墙配置
 */
export const paywallConfig = {
  // 定价页面URL
  pricingPageUrl: "/pricing",
  
  // 底部付费墙文案配置
  articlePaywall: {
    title: "购买会员解锁完整内容",
    description: "成为会员，获取所有高级内容和专属功能",
    buttonText: "查看会员选项",
    fallbackButtonText: "继续阅读",
  },
  
  // 侧边栏促销文案配置
  sidebarPromotion: {
    title: "限时优惠",
    description: "立即订阅会员，享受所有高级内容",
    buttonText: "了解更多",
    discountText: "优惠{discount}%",
  },

  // 内容预览配置
  preview: {
    defaultPercentage: 30,      // 默认预览百分比
    minPreviewLength: 500,      // 最小预览长度（字符数）
    gradientHeightPx: 150,      // 渐变区域高度
  }
};

/**
 * 模拟数据 - 仅用于开发和测试
 */
export const mockData = {
  // 模拟会员状态数据
  membershipStatus: {
    isPremium: false,
    // 其他字段为 undefined 表示非会员
  } as MembershipStatus,

  // 模拟文章付费状态
  articlePaywall: {
    isPremiumContent: true,
    previewPercentage: 30,
    price: 9.99
  } as ArticlePaywallConfig,

  // 模拟促销配置
  promotionConfig: {
    title: "限时优惠",
    description: "立即订阅会员，享受所有高级内容",
    buttonText: "查看会员选项",
    discountPercentage: 15,
    endDate: "2025-04-11T23:59:59+08:00",
    couponCode: "SPRING15",
    pricingPageUrl: "/pricing"
  } as PromotionConfig
};

/**
 * 判断内容是否付费并获取预览百分比
 * @param content 内容
 * @returns 付费内容信息
 */
export function detectPremiumContent(content: string): PremiumContentInfo {
  const result: PremiumContentInfo = {
    isPremium: false
  };
  
  // 检查特殊注释标记
  if (content.includes('<!-- premium -->') || 
      content.includes('<!-- paywall -->')) {
    result.isPremium = true;
  }
  
  // 检查frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    
    // 检查是否为付费内容
    if (frontmatter.includes('premium: true') || 
        frontmatter.includes('paywall: true')) {
      result.isPremium = true;
    }
    
    // 提取预览百分比
    const percentageMatch = frontmatter.match(/percentage:\s*(\d+)/);
    if (percentageMatch) {
      const percentage = parseInt(percentageMatch[1], 10);
      if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
        result.previewPercentage = percentage;
      }
    }
  }
  
  return result;
}

/**
 * 获取内容预览
 * @param content 完整内容
 * @param contentInfo 付费内容信息
 * @returns 预览内容
 */
export function getContentPreview(
  content: string, 
  contentInfo?: PremiumContentInfo
): string {
  // 确定预览百分比
  let percentage = paywallConfig.preview.defaultPercentage;
  
  if (contentInfo?.previewPercentage !== undefined) {
    percentage = contentInfo.previewPercentage;
  }
  
  const minLength = paywallConfig.preview.minPreviewLength;
  const previewLength = Math.max(
    minLength,
    Math.floor(content.length * (percentage / 100))
  );
  
  return content.substring(0, previewLength);
}
