'use client';

import React, { useEffect } from 'react';
import type { SecurityConfig } from '@/types/security';

interface SecurityProviderProps {
  children: React.ReactNode;
  config: SecurityConfig;
}

const defaultConfig: SecurityConfig = {
  watermark: {
    enabled: true,
    text: '保密文档',
    color: 'rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    opacity: 0.1,
    rotate: -30
  },
  keyboardShortcuts: {
    enabled: true,
    preventDefault: {
      ctrlC: true,
      ctrlS: true,
      ctrlP: true,
      ctrlShiftI: true,
      f12: true
    }
  },
  devTools: {
    enabled: true,
    message: '为了保护文档安全，已禁用开发者工具'
  }
};

export function SecurityProvider({ children, config }: SecurityProviderProps) {
  const mergedConfig = { ...defaultConfig, ...config };

  // 添加水印
  useEffect(() => {
    if (!mergedConfig.watermark?.enabled) return;

    const watermark = document.createElement('div');
    const { text, color, fontSize, opacity, rotate } = mergedConfig.watermark;

    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background-image: repeating-linear-gradient(
        ${rotate}deg,
        ${color || 'rgba(0, 0, 0, 0.1)'},
        ${color || 'rgba(0, 0, 0, 0.1)'} 1px,
        transparent 1px,
        transparent 100px
      );
    `;

    // 创建水印文字
    const createWatermarkText = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      canvas.width = 200;
      canvas.height = 200;
      ctx.font = `${fontSize || '16px'} Arial`;
      ctx.fillStyle = color || 'rgba(0, 0, 0, 0.1)';
      ctx.globalAlpha = opacity || 0.1;
      ctx.rotate((rotate || -30) * Math.PI / 180);
      ctx.fillText(text, 0, 100);
      
      return `url(${canvas.toDataURL()})`;
    };

    watermark.style.backgroundImage = createWatermarkText();
    document.body.appendChild(watermark);

    return () => {
      document.body.removeChild(watermark);
    };
  }, [mergedConfig.watermark]);

  // 禁用开发者工具和键盘快捷键
  useEffect(() => {
    if (!mergedConfig.devTools?.enabled && !mergedConfig.keyboardShortcuts?.enabled) return;

    const message = mergedConfig.devTools?.message || '为了保护文档安全，已禁用开发者工具';
    let devToolsWarningShown = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { preventDefault } = mergedConfig.keyboardShortcuts || {};
      
      // 检查是否为开发者工具快捷键
      const isDevToolsKey = 
        (e.key === 'F12') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === 'i') ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === 'j') ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === 'c');

      // 检查是否为其他需要阻止的快捷键
      const isPreventedKey = preventDefault && (
        (preventDefault.ctrlC && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') ||
        (preventDefault.ctrlS && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') ||
        (preventDefault.ctrlP && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p')
      );

      if (mergedConfig.devTools?.enabled && isDevToolsKey) {
        e.preventDefault();
        if (!devToolsWarningShown) {
          alert(message);
          devToolsWarningShown = true;
          // 5秒后重置警告状态，避免频繁弹窗
          setTimeout(() => {
            devToolsWarningShown = false;
          }, 5000);
        }
        return;
      }

      if (mergedConfig.keyboardShortcuts?.enabled && isPreventedKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 禁用右键菜单
    const handleContextMenu = (e: MouseEvent) => {
      if (mergedConfig.devTools?.enabled) {
        e.preventDefault();
      }
    };

    // 覆盖控制台方法
    if (mergedConfig.devTools?.enabled) {
      const noop = () => undefined;
      const methods: (keyof Console)[] = ['log', 'debug', 'info', 'warn', 'error'];
      methods.forEach(method => {
        (console[method] as any) = noop;
      });
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [mergedConfig.devTools, mergedConfig.keyboardShortcuts]);

  return <>{children}</>;
} 