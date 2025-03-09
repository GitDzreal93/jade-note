'use client';

import React from 'react';
import type { SecurityConfig } from '@/types/security';
import { SecurityProvider } from '@/components/security/SecurityProvider';

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
  return (
    <SecurityProvider config={securityConfig}>
      <style>{noCopyStyle}</style>
      <div 
        className="min-h-[calc(100vh-4rem)] pt-8 no-copy" 
        onContextMenu={(e) => e.preventDefault()}
      >
        {children}
      </div>
    </SecurityProvider>
  );
} 