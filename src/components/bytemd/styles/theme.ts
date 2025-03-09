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
  
  /* 代码块语言标记 - 修改选择器和样式 */
  .bytemd-viewer pre[data-lang]::before,
  .markdown-body pre[data-lang]::before {
    content: attr(data-lang);
    position: absolute !important;
    top: 0.5rem !important;
    right: 0.5rem !important;
    padding: 0.1rem 0.5rem !important;
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
    font-weight: 500 !important;
    color: #6e7781 !important;
    background: #f0f1f2 !important;
    border-radius: 0.25rem !important;
    opacity: 0.8 !important;
    pointer-events: none !important;
    z-index: 10 !important;
    text-transform: lowercase !important;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace !important;
    letter-spacing: 0.025em !important;
    user-select: none !important;
  }

  /* 隐藏空的语言标记 */
  .bytemd-viewer pre[data-lang=""]::before,
  .markdown-body pre[data-lang=""]::before,
  .bytemd-viewer pre[data-lang="text"]::before,
  .markdown-body pre[data-lang="text"]::before,
  .bytemd-viewer pre:not([data-lang])::before,
  .markdown-body pre:not([data-lang])::before {
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
  
  /* 暗色模式语言标记 */
  .markdown-body-dark pre[data-lang]::before {
    background: #2d2d2d !important;
    color: #8b949e !important;
    border: 1px solid #404040 !important;
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
  
  /* 语法高亮颜色 - 通用 */
  .bytemd-viewer pre .token.keyword,
  .markdown-body pre .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre .token.string,
  .markdown-body pre .token.string {
    color: #0a3069 !important;
  }

  .bytemd-viewer pre .token.comment,
  .markdown-body pre .token.comment {
    color: #6e7781 !important;
    font-style: italic !important;
  }

  .bytemd-viewer pre .token.function,
  .markdown-body pre .token.function {
    color: #8250df !important;
  }

  .bytemd-viewer pre .token.number,
  .markdown-body pre .token.number {
    color: #0550ae !important;
  }

  .bytemd-viewer pre .token.operator,
  .markdown-body pre .token.operator {
    color: #0550ae !important;
  }

  .bytemd-viewer pre .token.punctuation,
  .markdown-body pre .token.punctuation {
    color: #24292f !important;
  }

  .bytemd-viewer pre .token.class-name,
  .markdown-body pre .token.class-name {
    color: #953800 !important;
  }

  .bytemd-viewer pre .token.boolean,
  .markdown-body pre .token.boolean {
    color: #0550ae !important;
  }

  .bytemd-viewer pre .token.property,
  .markdown-body pre .token.property {
    color: #953800 !important;
  }

  .bytemd-viewer pre .token.variable,
  .markdown-body pre .token.variable {
    color: #953800 !important;
  }

  /* TypeScript/JavaScript 特定样式 */
  .bytemd-viewer pre.language-typescript .token.keyword,
  .bytemd-viewer pre.language-javascript .token.keyword,
  .bytemd-viewer pre.language-jsx .token.keyword,
  .bytemd-viewer pre.language-tsx .token.keyword,
  .markdown-body pre.language-typescript .token.keyword,
  .markdown-body pre.language-javascript .token.keyword,
  .markdown-body pre.language-jsx .token.keyword,
  .markdown-body pre.language-tsx .token.keyword {
    color: #cf222e !important;
  }

  /* Python 特定样式 */
  .bytemd-viewer pre.language-python .token.keyword,
  .markdown-body pre.language-python .token.keyword {
    color: #0550ae !important;
  }

  .bytemd-viewer pre.language-python .token.builtin,
  .markdown-body pre.language-python .token.builtin {
    color: #8250df !important;
  }

  /* HTML 特定样式 */
  .bytemd-viewer pre.language-html .token.tag,
  .markdown-body pre.language-html .token.tag {
    color: #116329 !important;
  }

  .bytemd-viewer pre.language-html .token.attr-name,
  .markdown-body pre.language-html .token.attr-name {
    color: #953800 !important;
  }

  .bytemd-viewer pre.language-html .token.attr-value,
  .markdown-body pre.language-html .token.attr-value {
    color: #0a3069 !important;
  }

  /* CSS 特定样式 */
  .bytemd-viewer pre.language-css .token.property,
  .markdown-body pre.language-css .token.property {
    color: #0550ae !important;
  }

  .bytemd-viewer pre.language-css .token.selector,
  .markdown-body pre.language-css .token.selector {
    color: #116329 !important;
  }

  /* Shell/Bash 特定样式 */
  .bytemd-viewer pre.language-shell .token.function,
  .markdown-body pre.language-shell .token.function {
    color: #0550ae !important;
  }

  .bytemd-viewer pre.language-shell .token.parameter,
  .markdown-body pre.language-shell .token.parameter {
    color: #953800 !important;
  }

  /* Go 特定样式 */
  .bytemd-viewer pre.language-go .token.keyword,
  .markdown-body pre.language-go .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-go .token.function,
  .markdown-body pre.language-go .token.function {
    color: #8250df !important;
  }

  .bytemd-viewer pre.language-go .token.builtin,
  .markdown-body pre.language-go .token.builtin {
    color: #0550ae !important;
  }

  .bytemd-viewer pre.language-go .token.type,
  .markdown-body pre.language-go .token.type {
    color: #953800 !important;
  }

  /* Java 特定样式 */
  .bytemd-viewer pre.language-java .token.keyword,
  .markdown-body pre.language-java .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-java .token.class-name,
  .markdown-body pre.language-java .token.class-name {
    color: #953800 !important;
  }

  .bytemd-viewer pre.language-java .token.annotation,
  .markdown-body pre.language-java .token.annotation {
    color: #116329 !important;
  }

  /* PHP 特定样式 */
  .bytemd-viewer pre.language-php .token.keyword,
  .markdown-body pre.language-php .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-php .token.variable,
  .markdown-body pre.language-php .token.variable {
    color: #953800 !important;
  }

  .bytemd-viewer pre.language-php .token.function,
  .markdown-body pre.language-php .token.function {
    color: #8250df !important;
  }

  .bytemd-viewer pre.language-php .token.namespace,
  .markdown-body pre.language-php .token.namespace {
    color: #116329 !important;
  }

  /* Kotlin 特定样式 */
  .bytemd-viewer pre.language-kotlin .token.keyword,
  .markdown-body pre.language-kotlin .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-kotlin .token.function,
  .markdown-body pre.language-kotlin .token.function {
    color: #8250df !important;
  }

  .bytemd-viewer pre.language-kotlin .token.annotation,
  .markdown-body pre.language-kotlin .token.annotation {
    color: #116329 !important;
  }

  .bytemd-viewer pre.language-kotlin .token.type-parameter,
  .markdown-body pre.language-kotlin .token.type-parameter {
    color: #953800 !important;
  }

  /* Dart 特定样式 */
  .bytemd-viewer pre.language-dart .token.keyword,
  .markdown-body pre.language-dart .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-dart .token.class-name,
  .markdown-body pre.language-dart .token.class-name {
    color: #953800 !important;
  }

  .bytemd-viewer pre.language-dart .token.annotation,
  .markdown-body pre.language-dart .token.annotation {
    color: #116329 !important;
  }

  .bytemd-viewer pre.language-dart .token.metadata,
  .markdown-body pre.language-dart .token.metadata {
    color: #0550ae !important;
  }

  /* Swift 特定样式 */
  .bytemd-viewer pre.language-swift .token.keyword,
  .markdown-body pre.language-swift .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-swift .token.function,
  .markdown-body pre.language-swift .token.function {
    color: #8250df !important;
  }

  .bytemd-viewer pre.language-swift .token.type,
  .markdown-body pre.language-swift .token.type {
    color: #953800 !important;
  }

  .bytemd-viewer pre.language-swift .token.property,
  .markdown-body pre.language-swift .token.property {
    color: #0550ae !important;
  }

  /* Groovy 特定样式 */
  .bytemd-viewer pre.language-groovy .token.keyword,
  .markdown-body pre.language-groovy .token.keyword {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-groovy .token.function,
  .markdown-body pre.language-groovy .token.function {
    color: #8250df !important;
  }

  .bytemd-viewer pre.language-groovy .token.annotation,
  .markdown-body pre.language-groovy .token.annotation {
    color: #116329 !important;
  }

  .bytemd-viewer pre.language-groovy .token.string-interpolation,
  .markdown-body pre.language-groovy .token.string-interpolation {
    color: #0550ae !important;
  }

  /* 暗色模式语法高亮 */
  .markdown-body-dark pre .token.keyword {
    color: #ff7b72 !important;
  }

  .markdown-body-dark pre .token.string {
    color: #a5d6ff !important;
  }

  .markdown-body-dark pre .token.comment {
    color: #8b949e !important;
  }

  .markdown-body-dark pre .token.function {
    color: #d2a8ff !important;
  }

  .markdown-body-dark pre .token.number {
    color: #79c0ff !important;
  }

  .markdown-body-dark pre .token.operator {
    color: #79c0ff !important;
  }

  .markdown-body-dark pre .token.punctuation {
    color: #c9d1d9 !important;
  }

  .markdown-body-dark pre .token.class-name {
    color: #ffa657 !important;
  }

  .markdown-body-dark pre .token.boolean {
    color: #79c0ff !important;
  }

  .markdown-body-dark pre .token.property {
    color: #ffa657 !important;
  }

  .markdown-body-dark pre .token.variable {
    color: #ffa657 !important;
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

  /* JSX/TSX 特定样式 */
  .bytemd-viewer pre.language-jsx .token.tag,
  .bytemd-viewer pre.language-tsx .token.tag,
  .markdown-body pre.language-jsx .token.tag,
  .markdown-body pre.language-tsx .token.tag {
    color: #116329 !important;
  }

  .bytemd-viewer pre.language-jsx .token.attr-name,
  .bytemd-viewer pre.language-tsx .token.attr-name,
  .markdown-body pre.language-jsx .token.attr-name,
  .markdown-body pre.language-tsx .token.attr-name {
    color: #953800 !important;
  }

  .bytemd-viewer pre.language-jsx .token.attr-value,
  .bytemd-viewer pre.language-tsx .token.attr-value,
  .markdown-body pre.language-jsx .token.attr-value,
  .markdown-body pre.language-tsx .token.attr-value {
    color: #0a3069 !important;
  }

  .bytemd-viewer pre.language-jsx .token.component,
  .bytemd-viewer pre.language-tsx .token.component,
  .markdown-body pre.language-jsx .token.component,
  .markdown-body pre.language-tsx .token.component {
    color: #8250df !important;
  }

  /* Vue 特定样式 */
  .bytemd-viewer pre.language-vue .token.tag,
  .markdown-body pre.language-vue .token.tag {
    color: #116329 !important;
  }

  .bytemd-viewer pre.language-vue .token.attr-name,
  .markdown-body pre.language-vue .token.attr-name {
    color: #953800 !important;
  }

  .bytemd-viewer pre.language-vue .token.attr-value,
  .markdown-body pre.language-vue .token.attr-value {
    color: #0a3069 !important;
  }

  .bytemd-viewer pre.language-vue .token.directive,
  .markdown-body pre.language-vue .token.directive {
    color: #cf222e !important;
  }

  .bytemd-viewer pre.language-vue .token.script-tag,
  .markdown-body pre.language-vue .token.script-tag {
    color: #8250df !important;
  }

  .bytemd-viewer pre.language-vue .token.style-tag,
  .markdown-body pre.language-vue .token.style-tag {
    color: #0550ae !important;
  }

  .bytemd-viewer pre.language-vue .token.template-tag,
  .markdown-body pre.language-vue .token.template-tag {
    color: #116329 !important;
  }

  /* 暗色模式下的 JSX/TSX/Vue 样式 */
  .markdown-body-dark pre.language-jsx .token.tag,
  .markdown-body-dark pre.language-tsx .token.tag,
  .markdown-body-dark pre.language-vue .token.tag {
    color: #7ee787 !important;
  }

  .markdown-body-dark pre.language-jsx .token.attr-name,
  .markdown-body-dark pre.language-tsx .token.attr-name,
  .markdown-body-dark pre.language-vue .token.attr-name {
    color: #ffa657 !important;
  }

  .markdown-body-dark pre.language-jsx .token.attr-value,
  .markdown-body-dark pre.language-tsx .token.attr-value,
  .markdown-body-dark pre.language-vue .token.attr-value {
    color: #a5d6ff !important;
  }

  .markdown-body-dark pre.language-jsx .token.component,
  .markdown-body-dark pre.language-tsx .token.component {
    color: #d2a8ff !important;
  }

  .markdown-body-dark pre.language-vue .token.directive {
    color: #ff7b72 !important;
  }

  .markdown-body-dark pre.language-vue .token.script-tag,
  .markdown-body-dark pre.language-vue .token.style-tag,
  .markdown-body-dark pre.language-vue .token.template-tag {
    color: #d2a8ff !important;
  }
`; 