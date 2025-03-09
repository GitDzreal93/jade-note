/**
 * 分析DOM结构并检查标题元素
 */
export const analyzeHeadingStructure = (): void => {
  console.log('Debug: 分析文档标题结构');
  
  // 检查所有可能的h1选择器
  const selectors = [
    '.bytemd-viewer h1', 
    '.markdown-body h1',
    '.bytemd-viewer > div > h1', 
    '.markdown-body > div > h1',
    'h1',
    'div > h1'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`Debug: 选择器 "${selector}" 找到 ${elements.length} 个元素`);
    
    if (elements.length > 0) {
      elements.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        console.log(`Debug: 元素 ${i} 的内容:`, {
          innerHTML: htmlEl.innerHTML,
          outerHTML: htmlEl.outerHTML,
          textContent: htmlEl.textContent,
          display: htmlEl.style.display || getComputedStyle(htmlEl).display,
          visibility: htmlEl.style.visibility || getComputedStyle(htmlEl).visibility,
          fontSize: htmlEl.style.fontSize || getComputedStyle(htmlEl).fontSize
        });
      });
    }
  });
  
  // 分析整个文档结构
  console.log('Debug: 文档结构概览', {
    bytemdViewer: document.querySelector('.bytemd-viewer')?.innerHTML?.substring(0, 500),
    markdownBody: document.querySelector('.markdown-body')?.innerHTML?.substring(0, 500)
  });
};

/**
 * 优化标题显示和层级结构
 */
export const optimizeHeadingDisplay = (): void => {
  const h1Elements = document.querySelectorAll('.bytemd-viewer h1, .markdown-body h1, .bytemd-viewer > div > h1, .markdown-body > div > h1, h1');
  console.log(`BytemdViewer: 找到 ${h1Elements.length} 个 h1 标题`);
  
  if (h1Elements.length === 0) {
    console.log('Debug: 没有找到 h1 元素，尝试创建主标题');
    
    // 尝试创建主标题元素
    const container = document.querySelector('.bytemd-viewer') || document.querySelector('.markdown-body');
    if (container) {
      // 检查是否已经存在"一级目录"文本
      const content = container.textContent || '';
      if (content.includes('一级目录') && !document.querySelector('.manually-added-h1')) {
        console.log('Debug: 找到文本"一级目录"，创建主标题');
        
        // 在容器开头插入 h1
        const h1 = document.createElement('h1');
        h1.textContent = '一级目录';
        h1.className = 'manually-added-h1 bytemd-h1 bytemd-h1-first';
        h1.style.fontSize = '2.5em';
        h1.style.fontWeight = 'bold';
        h1.style.marginTop = '0.5em';
        h1.style.marginBottom = '0.8em';
        h1.style.borderBottom = '1px solid #eaecef';
        h1.style.paddingBottom = '0.3em';
        h1.style.display = 'block';
        h1.style.visibility = 'visible';
        h1.style.opacity = '1';
        h1.style.color = '#000';
        
        // 尝试在适当的位置插入
        const firstParagraph = container.querySelector('p');
        if (firstParagraph) {
          container.insertBefore(h1, firstParagraph.nextSibling);
        } else {
          container.prepend(h1);
        }
        
        console.log('Debug: 创建的主标题元素', h1);
      }
    }
  } else {
    h1Elements.forEach((h1, index) => {
      // 增强 h1 标题的样式
      const htmlH1 = h1 as HTMLElement;
      console.log(`Debug: 优化 h1 元素 ${index}`, {
        innerHTML: htmlH1.innerHTML,
        textContent: htmlH1.textContent,
        className: htmlH1.className
      });
      
      // 应用样式增强
      htmlH1.style.fontSize = index === 0 ? '2.5em' : '2em';
      htmlH1.style.fontWeight = 'bold';
      htmlH1.style.marginTop = index === 0 ? '0.5em' : '1.5em';
      htmlH1.style.marginBottom = '0.8em';
      htmlH1.style.borderBottom = '1px solid #eaecef';
      htmlH1.style.paddingBottom = '0.3em';
      htmlH1.style.display = 'block';
      htmlH1.style.visibility = 'visible';
      htmlH1.style.opacity = '1';
      htmlH1.style.color = index === 0 ? '#000' : '#24292e';
      
      // 添加特殊类名以便于 CSS 选择器定位
      htmlH1.classList.add('bytemd-h1');
      if (index === 0) {
        htmlH1.classList.add('bytemd-h1-first');
      }
    });
  }
}; 