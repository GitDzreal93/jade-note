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
    color: 'rgba(0, 0, 0, 0.12)',    // 使用黑色，适中的透明度
    fontSize: '16px',                // 适中的字体大小
    rotate: -30,
    username: ''
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
  const mergedConfig = {
    ...defaultConfig,
    ...(config || {}),
    watermark: config?.watermark || defaultConfig.watermark
  };

  console.log('SecurityProvider config:', config);
  console.log('SecurityProvider mergedConfig:', mergedConfig);

  // 添加水印
  useEffect(() => {
    if (!mergedConfig.watermark?.enabled) return;

    const watermark = document.createElement('div');
    const { text, color, fontSize, opacity, rotate, username } = mergedConfig.watermark;

    // 创建水印文字
    const createWatermarkText = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      // 保持画布尺寸
      canvas.width = 1200;
      canvas.height = 1000;

      // 设置文字样式
      ctx.font = `${fontSize || '14px'} Arial`;
      ctx.fillStyle = color || 'rgba(120, 120, 120, 0.75)';  // 添加默认颜色
      ctx.globalAlpha = 1;    // 不再使用 globalAlpha，因为透明度已经包含在颜色中
      
      // 移除阴影效果
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 在画布上绘制文字
      ctx.translate(600, 500);
      ctx.rotate((rotate || -30) * Math.PI / 180);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 组合水印文字
      const watermarkText = username ? `${username} - ${text}` : text;
      
      // 使用更大的间距绘制水印，减少密度
      const positions = [
        [0, 0],           // 中心
        [-400, -200],     // 左上
        [400, 200],       // 右下
        [-400, 200],      // 左下
        [400, -200],      // 右上
        [0, -400],        // 上
        [0, 400],         // 下
        [-400, 0],        // 左
        [400, 0],         // 右
        [-200, -400],     // 左上偏上
        [200, -400],      // 右上偏上
        [-200, 400],      // 左下偏下
        [200, 400],       // 右下偏下
        [-600, -300],     // 远左上
        [600, 300],       // 远右下
        [-600, 300],      // 远左下
        [600, -300],      // 远右上
      ];

      // 绘制所有位置的水印
      positions.forEach(([x, y]) => {
        ctx.fillText(watermarkText, x, y);
      });
      
      return `url(${canvas.toDataURL()})`;
    };

    // 更新水印容器样式
    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99999;
      background-repeat: repeat;
      background-position: center center;
      background-size: 1200px 1000px;
      opacity: 1;
    `;

    watermark.style.backgroundImage = createWatermarkText();
    document.body.appendChild(watermark);

    // 监听 DOM 变化，防止水印被移除
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!document.body.contains(watermark)) {
          document.body.appendChild(watermark.cloneNode(true));
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // 定期检查水印是否存在（以防万一）
    const checkInterval = setInterval(() => {
      if (!document.body.contains(watermark)) {
        document.body.appendChild(watermark.cloneNode(true));
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      if (document.body.contains(watermark)) {
        document.body.removeChild(watermark);
      }
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