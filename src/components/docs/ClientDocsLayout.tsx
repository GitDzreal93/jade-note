'use client';

import React from 'react';
import type { SecurityConfig } from '@/types/security';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { PaywallProvider } from '@/components/paywall/context';

interface ClientDocsLayoutProps {
  children: React.ReactNode;
  securityConfig?: SecurityConfig;
}

// 禁止复制的样式
const noCopyStyle = `
  .no-copy {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
`;

export function ClientDocsLayout({ children, securityConfig }: ClientDocsLayoutProps) {
  // 创建默认的安全配置
  const defaultSecurityConfig: SecurityConfig = {
    watermark: {
      enabled: false,
      text: ''
    },
    keyboardShortcuts: {
      enabled: false
    },
    devTools: {
      enabled: false
    }
  };

  return (
    <SecurityProvider config={securityConfig || defaultSecurityConfig}>
      <PaywallProvider>
        <style>{noCopyStyle}</style>
        <div 
          className="min-h-[calc(100vh-4rem)] pt-8 no-copy" 
          onContextMenu={(e) => e.preventDefault()}
        >
          {children}
        </div>
      </PaywallProvider>
    </SecurityProvider>
  );
}