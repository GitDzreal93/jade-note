// 导出用于BytemdViewer的主题样式
export const customStyles = `
  /* 代码块样式 */
  .bytemd-viewer pre, .markdown-body pre {
    background-color: #f8f9fa !important;
    border-radius: 8px !important;
    padding: 16px !important;
    margin: 1em 0 !important;
    overflow: auto !important;
    position: relative !important;
    border: 1px solid #e9ecef !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
  }
  
  .bytemd-viewer pre code, .markdown-body pre code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #24292e !important;
    background: none !important;
    border: none !important;
    padding: 0 !important;
    white-space: pre !important;
    tab-size: 2 !important;
    display: block !important;
  }
  
  /* 代码块语言标记 */
  .bytemd-viewer pre::before, .markdown-body pre::before {
    content: attr(data-lang);
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    color: #6e7781;
    background: #f0f1f2;
    border-bottom-left-radius: 4px;
    border-top-right-radius: 8px;
    pointer-events: none;
    z-index: 10;
  }
  
  /* 隐藏代码块内部的语言标记 */
  .bytemd-viewer pre code > .token:first-child,
  .markdown-body pre code > .token:first-child {
    display: none !important;
  }
  
  /* 暗色模式代码块 */
  .markdown-body-dark pre {
    background-color: #1e1e1e !important;
    border-color: #2d2d2d !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
  }
  
  .markdown-body-dark pre code {
    color: #e6e6e6 !important;
  }
  
  .markdown-body-dark pre::before {
    background: #2d2d2d;
    color: #a0a0a0;
  }
  
  /* 行内代码 */
  .bytemd-viewer code:not(pre code), .markdown-body code:not(pre code) {
    background-color: rgba(175, 184, 193, 0.2) !important;
    border-radius: 4px !important;
    padding: 0.2em 0.4em !important;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
    font-size: 85% !important;
  }
  
  .markdown-body-dark code:not(pre code) {
    background-color: rgba(110, 118, 129, 0.4) !important;
  }
  
  /* 语法高亮颜色 */
  .bytemd-viewer pre.language-js .token.keyword,
  .markdown-body pre.language-js .token.keyword {
    color: #cf222e !important;
  }
  
  .bytemd-viewer pre.language-js .token.string,
  .markdown-body pre.language-js .token.string {
    color: #0a3069 !important;
  }
  
  .bytemd-viewer pre.language-js .token.comment,
  .markdown-body pre.language-js .token.comment {
    color: #6e7781 !important;
    font-style: italic !important;
  }
  
  .bytemd-viewer pre.language-js .token.function,
  .markdown-body pre.language-js .token.function {
    color: #8250df !important;
  }
  
  /* 暗色模式语法高亮 */
  .markdown-body-dark pre.language-js .token.keyword {
    color: #ff7b72 !important;
  }
  
  .markdown-body-dark pre.language-js .token.string {
    color: #a5d6ff !important;
  }
  
  .markdown-body-dark pre.language-js .token.comment {
    color: #8b949e !important;
  }
  
  .markdown-body-dark pre.language-js .token.function {
    color: #d2a8ff !important;
  }

  /* 列表样式 */
  /* 基本列表样式 */
  .bytemd-viewer ul, .markdown-body ul {
    list-style-type: disc !important;
    padding-left: 2em !important;
    margin: 1em 0 !important;
  }
  
  .bytemd-viewer ol, .markdown-body ol {
    list-style-type: decimal !important;
    padding-left: 2em !important;
    margin: 1em 0 !important;
  }
  
  .bytemd-viewer ul li, .bytemd-viewer ol li,
  .markdown-body ul li, .markdown-body ol li {
    display: list-item !important;
    margin: 0.5em 0 !important;
    position: relative !important;
    list-style-position: outside !important;
  }
  
  /* 定制列表标记 */
  .bytemd-viewer ul li::marker, .markdown-body ul li::marker {
    color: currentColor !important;
    display: inline-block !important;
  }
  
  .bytemd-viewer ol li::marker, .markdown-body ol li::marker {
    color: currentColor !important;
    display: inline-block !important;
  }
  
  /* 嵌套列表样式 */
  .bytemd-viewer ul ul, .bytemd-viewer ol ul,
  .markdown-body ul ul, .markdown-body ol ul {
    list-style-type: circle !important;
  }
  
  .bytemd-viewer ul ul ul, .bytemd-viewer ol ul ul,
  .markdown-body ul ul ul, .markdown-body ol ul ul {
    list-style-type: square !important;
  }
  
  /* 移除自定义类的列表样式，防止重复显示 */
  .bytemd-viewer ul.md-list-disc li::before, 
  .markdown-body ul.md-list-disc li::before,
  .bytemd-viewer ol.md-list-decimal li::before, 
  .markdown-body ol.md-list-decimal li::before {
    content: none !important;
  }
  
  /* 链接样式 */
  .bytemd-viewer a, .markdown-body a {
    color: #0969da !important;
    text-decoration: none !important;
    transition: color 0.2s ease !important;
    display: inline !important;
  }
  
  /* 标题中的链接不显示蓝色 */
  .bytemd-viewer h1 a, .bytemd-viewer h2 a, .bytemd-viewer h3 a,
  .markdown-body h1 a, .markdown-body h2 a, .markdown-body h3 a {
    color: inherit !important;
    border-bottom: none !important;
  }
  
  /* 隐藏 h4, h5, h6 的链接图标 */
  .bytemd-viewer h4 a.heading-anchor, 
  .bytemd-viewer h5 a.heading-anchor, 
  .bytemd-viewer h6 a.heading-anchor,
  .markdown-body h4 a.heading-anchor, 
  .markdown-body h5 a.heading-anchor, 
  .markdown-body h6 a.heading-anchor {
    display: none !important;
  }
  
  .bytemd-viewer a:hover, .markdown-body a:hover {
    color: #0550ae !important;
    text-decoration: underline !important;
  }
  
  /* 链接图标样式 */
  .bytemd-viewer a svg, .markdown-body a svg {
    display: inline-block !important;
    vertical-align: middle !important;
    margin-right: 0.25rem !important;
    flex-shrink: 0 !important;
  }
  
  /* 标题样式 */
  .bytemd-viewer h1, .markdown-body h1,
  .bytemd-viewer > div > h1, .markdown-body > div > h1 {
    font-size: 2em !important;
    font-weight: bold !important;
    margin-top: 1.5em !important;
    margin-bottom: 0.8em !important;
    border-bottom: 1px solid #eaecef !important;
    padding-bottom: 0.3em !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    color: #24292e !important;
  }
  
  /* 特别处理一级目录 */
  .bytemd-viewer h1:first-of-type, .markdown-body h1:first-of-type,
  .bytemd-viewer > div > h1:first-of-type, .markdown-body > div > h1:first-of-type {
    font-size: 2.5em !important;
    color: #000 !important;
    margin-top: 0.5em !important;
  }
  
  /* 确保 HTML 标签也能正确渲染 */
  .bytemd-viewer > div > h1, .markdown-body > div > h1 {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .bytemd-viewer h2, .markdown-body h2,
  .bytemd-viewer > div > h2, .markdown-body > div > h2 {
    font-size: 1.5em !important;
    font-weight: bold !important;
    margin-top: 1.5em !important;
    margin-bottom: 0.8em !important;
    padding-bottom: 0.3em !important;
    border-bottom: none !important;
    border: none !important;
  }
  
  .bytemd-viewer h3, .markdown-body h3,
  .bytemd-viewer > div > h3, .markdown-body > div > h3 {
    font-size: 1.25em !important;
    font-weight: bold !important;
    margin-top: 1.5em !important;
    margin-bottom: 0.8em !important;
    border-bottom: none !important;
    border: none !important;
  }
  
  /* 标题锚点样式 */
  .bytemd-viewer h1 a.heading-anchor, 
  .bytemd-viewer h2 a.heading-anchor, 
  .bytemd-viewer h3 a.heading-anchor,
  .markdown-body h1 a.heading-anchor, 
  .markdown-body h2 a.heading-anchor, 
  .markdown-body h3 a.heading-anchor {
    color: inherit !important;
    text-decoration: none !important;
    display: block !important;
    border-bottom: none !important;
  }
  
  /* 标题锚点图标颜色 - 使用主题色 */
  .bytemd-viewer h1 a.heading-anchor svg, 
  .bytemd-viewer h2 a.heading-anchor svg, 
  .bytemd-viewer h3 a.heading-anchor svg,
  .markdown-body h1 a.heading-anchor svg, 
  .markdown-body h2 a.heading-anchor svg, 
  .markdown-body h3 a.heading-anchor svg {
    color: #10b981 !important; /* 主题色 emerald-600 */
    fill: #10b981 !important;
  }
  
  /* 隐藏 h4, h5, h6 的锚点图标 */
  .bytemd-viewer h4 a.heading-anchor svg, 
  .bytemd-viewer h5 a.heading-anchor svg, 
  .bytemd-viewer h6 a.heading-anchor svg,
  .markdown-body h4 a.heading-anchor svg, 
  .markdown-body h5 a.heading-anchor svg, 
  .markdown-body h6 a.heading-anchor svg {
    display: none !important;
  }
  
  .bytemd-viewer h1 a.heading-anchor:hover, 
  .bytemd-viewer h2 a.heading-anchor:hover, 
  .bytemd-viewer h3 a.heading-anchor:hover,
  .markdown-body h1 a.heading-anchor:hover, 
  .markdown-body h2 a.heading-anchor:hover, 
  .markdown-body h3 a.heading-anchor:hover {
    text-decoration: none !important;
  }
  
  /* 修复链接内容换行问题 */
  .bytemd-viewer a *, .markdown-body a * {
    display: inline-block !important;
    white-space: nowrap !important;
  }
  
  /* 链接标题样式 - 修复链接标题分行问题 */
  .bytemd-viewer h1 a, .bytemd-viewer h2 a, .bytemd-viewer h3 a,
  .markdown-body h1 a, .markdown-body h2 a, .markdown-body h3 a {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    width: auto !important;
    text-decoration: none !important;
    color: inherit !important;
    border-bottom: none !important;
  }
  
  /* 只在悬停时显示下划线 */
  .bytemd-viewer h1 a:hover, .bytemd-viewer h2 a:hover, .bytemd-viewer h3 a:hover,
  .markdown-body h1 a:hover, .markdown-body h2 a:hover, .markdown-body h3 a:hover {
    text-decoration: underline !important;
  }
  
  /* 确保 h1 标题正确显示 */
  .bytemd-viewer h1, .markdown-body h1 {
    display: block !important;
    font-size: 2em !important;
    margin-top: 0.67em !important;
    margin-bottom: 0.67em !important;
    font-weight: bold !important;
  }
  
  /* 移除标题下方的所有蓝色线条 */
  .bytemd-viewer h1::after, .bytemd-viewer h2::after, .bytemd-viewer h3::after,
  .markdown-body h1::after, .markdown-body h2::after, .markdown-body h3::after,
  .bytemd-viewer h1 > a::after, .bytemd-viewer h2 > a::after, .bytemd-viewer h3 > a::after,
  .markdown-body h1 > a::after, .markdown-body h2 > a::after, .markdown-body h3 > a::after {
    display: none !important;
    border: none !important;
    border-bottom: none !important;
    content: none !important;
  }
  
  /* 暗色模式链接样式 */
  .markdown-body-dark a {
    color: #58a6ff !important;
  }
  
  .markdown-body-dark a:hover {
    color: #79b8ff !important;
  }
`; 