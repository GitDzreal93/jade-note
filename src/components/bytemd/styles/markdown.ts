// 基础样式类
const baseStyles = 'prose prose-emerald max-w-none';

// 标题样式
const headingStyles = [
  'prose-headings:text-gray-900',
  'prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4',
  'prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3',
  'prose-h3:text-xl prose-h3:font-medium prose-h3:mb-2'
].join(' ');

// 文本和链接样式
const textStyles = [
  'prose-p:text-gray-600 prose-p:my-4',
  'prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-500',
  'prose-strong:font-semibold prose-strong:text-gray-900'
].join(' ');

// 代码样式
const codeStyles = [
  'prose-code:text-gray-800 prose-code:bg-gray-100',
  'prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
  'prose-pre:bg-gray-50 prose-pre:p-4',
  'prose-pre:text-gray-800 prose-pre:shadow-lg',
  'prose-pre:overflow-x-auto'
].join(' ');

// 图片样式
const imageStyles = [
  'prose-img:rounded-lg',
  'prose-img:shadow-md',
  'prose-img:my-4'
].join(' ');

// 列表样式
const listStyles = [
  'prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4',
  'prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4',
  'prose-li:my-2'
].join(' ');

// Markdown 查看器特定样式
const viewerStyles = 'bytemd-viewer markdown-body';

// 组合所有样式
export const markdownStyles = [
  viewerStyles,
  baseStyles,
  headingStyles,
  textStyles,
  codeStyles,
  imageStyles,
  listStyles
].join(' ');

export const getMarkdownClassName = (additionalClasses: string = '') => {
  const classes = [markdownStyles];
  if (additionalClasses) {
    classes.push(additionalClasses);
  }
  return classes.join(' ').trim();
}; 