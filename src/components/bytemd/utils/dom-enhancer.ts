/**
 * 增强Markdown渲染后的DOM结构
 */
export const enhanceMarkdownRendering = (): void => {
  try {
    console.log('BytemdViewer: 开始增强渲染效果');
    
    // 增强代码块样式和添加语言标记
    enhanceCodeBlocks();
    
    // 优化列表项显示
    enhanceLists();
    
    // 增强标题显示和锚点生成
    enhanceHeadings();
    
    // 优化链接样式
    enhanceLinks();
    
    // 处理代码块内容结构
    optimizeCodeBlockContent();
    
    console.log('BytemdViewer: 渲染增强完成');
  } catch (error) {
    console.error('BytemdViewer: 渲染增强过程中出现错误', error);
  }
};

/**
 * 增强代码块样式和添加语言标记
 */
const enhanceCodeBlocks = (): void => {
  const codeBlocks = document.querySelectorAll('.bytemd-viewer pre');
  console.log(`BytemdViewer: 找到 ${codeBlocks.length} 个代码块`);
  
  codeBlocks.forEach(block => {
    // 添加样式类
    block.classList.add('code-block-wrapper');
    
    // 获取语言类型
    const codeElement = block.querySelector('code');
    if (codeElement) {
      // 检查是否已经有语言标记
      let language = block.getAttribute('data-lang') || '';
      
      if (!language) {
        // 从类名中提取语言类型
        const classNames = Array.from(codeElement.classList);
        for (const className of classNames) {
          if (className.startsWith('language-')) {
            language = className.replace('language-', '');
            break;
          }
        }
      }
      
      // 如果还没有找到语言标记，尝试从代码内容中提取
      if (!language) {
        const codeText = codeElement.textContent || '';
        const firstLine = codeText.split('\n')[0];
        if (firstLine && firstLine.startsWith('```')) {
          const match = firstLine.match(/^```(\S+)/);
          if (match) {
            language = match[1];
          }
        }
      }
      
      // 处理语言别名
      const languageAliases: Record<string, string> = {
        'ts': 'typescript',
        'js': 'javascript',
        'jsx': 'jsx',
        'tsx': 'tsx',
        'vue': 'vue',
        'py': 'python',
        'sh': 'shell',
        'bash': 'shell',
        'zsh': 'shell',
        'kt': 'kotlin',
        'golang': 'go'
      };
      
      if (language && language in languageAliases) {
        language = languageAliases[language];
      }
      
      // 如果没有找到语言标记，默认为text
      if (!language) {
        language = 'text';
      }
      
      // 设置语言标记
      block.setAttribute('data-lang', language);
      
      // 添加颜色和样式
      (block as HTMLElement).style.position = 'relative';
      
      // 根据语言类型添加特定样式
      const languageClass = `language-${language}`;
      if (!block.classList.contains(languageClass)) {
        block.classList.add(languageClass);
      }
      if (!codeElement.classList.contains(languageClass)) {
        codeElement.classList.add(languageClass);
      }
      
      // 清理代码内容中的语言标记行
      const codeText = codeElement.textContent || '';
      if (codeText.startsWith('```')) {
        const lines = codeText.split('\n');
        // 移除第一行的语言标记
        if (lines[0].match(/^```\S*$/)) {
          lines.shift();
        }
        // 移除最后一行的结束标记
        if (lines.length > 0 && lines[lines.length - 1].trim() === '```') {
          lines.pop();
        }
        codeElement.textContent = lines.join('\n');
      }
    }
  });
};

/**
 * 优化列表项显示
 */
const enhanceLists = (): void => {
  const lists = document.querySelectorAll('.bytemd-viewer ul, .bytemd-viewer ol');
  console.log(`BytemdViewer: 找到 ${lists.length} 个列表`);
  
  lists.forEach(list => {
    // 检查列表是否有正确的列表样式
    const listItems = list.querySelectorAll('li');
    listItems.forEach(item => {
      // 确保列表项有正确的显示样式
      (item as HTMLElement).style.display = 'list-item';
    });
  });
};

/**
 * 增强标题显示和锚点生成
 */
const enhanceHeadings = (): void => {
  const headings = document.querySelectorAll('.bytemd-viewer h1, .bytemd-viewer h2, .bytemd-viewer h3, .bytemd-viewer h4, .bytemd-viewer h5, .bytemd-viewer h6');
  console.log(`BytemdViewer: 找到 ${headings.length} 个标题`);
  
  headings.forEach(heading => {
    const tagName = heading.tagName.toLowerCase();
    const level = parseInt(tagName.substring(1));
    
    // 确保标题正确显示
    (heading as HTMLElement).style.display = 'block';
    
    // 增强一级标题 (h1) 样式
    if (level === 1) {
      (heading as HTMLElement).style.fontSize = '2em';
      (heading as HTMLElement).style.fontWeight = 'bold';
      (heading as HTMLElement).style.marginTop = '1.5em';
      (heading as HTMLElement).style.marginBottom = '0.8em';
      (heading as HTMLElement).style.borderBottom = '1px solid #eaecef';
      (heading as HTMLElement).style.paddingBottom = '0.3em';
    }
    
    // 为 h1, h2, h3 生成锚点
    if (level <= 3) {
      // 检查是否已经有锚点
      const existingAnchor = heading.querySelector('a');
      if (!existingAnchor) {
        // 创建锚点 ID
        const headingText = heading.textContent || '';
        const headingId = headingText.trim().toLowerCase().replace(/\s+/g, '-');
        heading.id = headingId;
        
        // 添加锚点链接
        const anchor = document.createElement('a');
        anchor.href = `#${headingId}`;
        anchor.className = 'heading-anchor';
        anchor.innerHTML = heading.innerHTML;
        heading.innerHTML = '';
        heading.appendChild(anchor);
      }
    } else {
      // 对于 h4, h5, h6 不生成锚点
      const anchor = heading.querySelector('a');
      if (anchor && anchor.classList.contains('heading-anchor')) {
        // 将锚点内容提取出来
        heading.innerHTML = anchor.innerHTML;
      }
    }
  });
};

/**
 * 优化链接样式
 */
const enhanceLinks = (): void => {
  const links = document.querySelectorAll('.bytemd-viewer a');
  console.log(`BytemdViewer: 找到 ${links.length} 个链接`);
  
  links.forEach(link => {
    // 优化链接显示方式
    (link as HTMLElement).style.display = 'inline-flex';
    (link as HTMLElement).style.alignItems = 'center';
    
    // 隐藏链接中的SVG图标
    const svg = link.querySelector('svg');
    if (svg) {
      svg.style.display = 'none';
    }
  });
};

/**
 * 优化代码块内容结构
 */
const optimizeCodeBlockContent = (): void => {
  const viewerElement = document.querySelector('.bytemd-viewer');
  if (!viewerElement) return;
  
  // 处理独立的代码块结束标记
  const contentDivs = viewerElement.querySelectorAll('.markdown-body > div');
  console.log(`BytemdViewer: 检查 ${contentDivs.length} 个内容块`);
  
  contentDivs.forEach(div => {
    // 寻找被误解析为段落的代码块结束标记
    if (div.textContent && div.textContent.trim() === '```') {
      console.log('BytemdViewer: 移除错误解析的代码块结束标记');
      div.remove();
    }
  });

  // 处理代码块内容混合问题
  const allPres = viewerElement.querySelectorAll('pre code');
  console.log(`BytemdViewer: 检查 ${allPres.length} 个代码元素`);
  
  allPres.forEach(codeElement => {
    const codeText = codeElement.textContent || '';
    
    // 检查代码块中是否包含 ``` 结束标记后还有其他内容
    // 扩展匹配模式，包括更多可能的后续内容标记
    const closeBlockMatch = codeText.match(/```\s*\n(#+ |[\*\-\+]\s|\d+\.\s|\n\n|<|>)/m);
    if (closeBlockMatch && closeBlockMatch.index) {
      console.log('BytemdViewer: 优化代码块内容结构');
      // 找到了错误包含的内容，需要分割代码块
      const validCode = codeText.substring(0, closeBlockMatch.index + 3); // 保留 ``` 结束标记
      const remainingContent = codeText.substring(closeBlockMatch.index + 3);
      
      // 更新代码块内容
      codeElement.textContent = validCode;
      
      // 创建新元素显示剩余内容
      if (remainingContent.trim()) {
        const container = document.createElement('div');
        container.className = 'recovered-content';
        container.innerHTML = remainingContent;
        
        // 插入到代码块后面
        const preElement = codeElement.closest('pre');
        if (preElement && preElement.parentNode) {
          preElement.parentNode.insertBefore(container, preElement.nextSibling);
        }
      }
    }
    
    // 检查并移除代码块内部的语言标记和结束标记
    const lines = codeText.split('\n');
    let modified = false;
    
    // 检查第一行是否为语言标记
    if (lines.length > 0 && lines[0].match(/^```\S*$/)) {
      lines.shift();
      modified = true;
    }
    
    // 检查最后一行是否为结束标记
    if (lines.length > 0 && lines[lines.length - 1].trim() === '```') {
      lines.pop();
      modified = true;
    }
    
    // 如果有修改，更新代码内容
    if (modified) {
      codeElement.textContent = lines.join('\n');
    }
  });
}; 