/**
 * 预处理Markdown内容，优化渲染效果
 * @param content 原始Markdown内容
 * @returns 格式化后的Markdown内容
 */
export const preprocessMarkdown = (content: string): string => {
  try {
    console.log('BytemdViewer: 处理内容前', {
      contentLength: content.length,
      contentStart: content.substring(0, 100),
      contentEnd: content.substring(content.length - 100)
    });

    // 统一换行符，确保跨平台一致性
    let processed = content.replace(/\r\n/g, '\n');
    
    // 处理代码块
    processed = processCodeBlocks(processed);
    
    // 其他格式化处理
    processed = processed
      // 确保列表项前有空行，这样可以确保列表被正确渲染
      .replace(/(^|\n)(?!\n)([\*\-\+]\s|\d+\.\s)/gm, '$1\n$2')
      // 确保列表项有正确的缩进和空格
      .replace(/(^|\n)([\*\-\+])(?!\s)/gm, '$1$2 ')
      .replace(/(^|\n)(\d+\.)(?!\s)/gm, '$1$2 ');
      
    console.log('BytemdViewer: 处理内容后', {
      originalLength: content.length,
      processedLength: processed.length,
      changed: content !== processed
    });

    return processed;
  } catch (error) {
    console.error('BytemdViewer: 内容预处理错误', error);
    // 如果预处理失败，返回原始内容
    return content;
  }
};

/**
 * 处理Markdown中的代码块
 * 使用更可靠的方法处理嵌套代码块和语言标记
 */
function processCodeBlocks(content: string): string {
  // 使用状态机方式处理代码块，比正则表达式更可靠
  const lines = content.split('\n');
  const result: string[] = [];
  
  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockContent: string[] = [];
  let codeBlockStartLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const codeBlockMatch = line.match(/^```(\S*)$/);
    
    if (codeBlockMatch) {
      if (!inCodeBlock) {
        // 开始一个新的代码块
        inCodeBlock = true;
        codeBlockLanguage = codeBlockMatch[1] || 'text';
        codeBlockStartLine = i;
        // 添加代码块开始标记，包含语言标记
        result.push(`\`\`\`${codeBlockLanguage}`);
      } else {
        // 结束当前代码块
        inCodeBlock = false;
        
        // 检查代码块内容是否包含嵌套的代码块标记
        const processedContent = codeBlockContent
          .map(l => l.replace(/^```(\S*)$/, '\\```$1')) // 转义内部的代码块标记
          .join('\n');
        
        // 添加处理后的代码块内容
        result.push(processedContent);
        
        // 添加代码块结束标记
        result.push('```');
        
        // 重置代码块状态
        codeBlockContent = [];
        codeBlockLanguage = '';
        codeBlockStartLine = -1;
      }
    } else if (inCodeBlock) {
      // 收集代码块内容
      codeBlockContent.push(line);
    } else {
      // 普通内容，直接添加
      result.push(line);
    }
  }
  
  // 处理未闭合的代码块
  if (inCodeBlock) {
    console.warn(`未闭合的代码块，从第 ${codeBlockStartLine + 1} 行开始`);
    // 添加收集的代码块内容
    result.push(codeBlockContent.join('\n'));
    // 添加结束标记
    result.push('```');
  }
  
  // 确保代码块和标题之间有空行
  return result.join('\n').replace(/```\s*\n(#+ )/g, '```\n\n$1');
} 