export * from "./editor";
export * from "./viewer";

// 导出主要组件
export { BytemdViewer } from './viewer';

// 导出工具函数（如果需要在其他地方使用）
export { preprocessMarkdown } from './utils/content-formatter';
export { enhanceMarkdownRendering } from './utils/dom-enhancer';
export { analyzeHeadingStructure, optimizeHeadingDisplay } from './utils/heading-manager';
