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

    // 格式化Markdown内容
    let processed = content
      // 确保代码块的语言标记正确
      .replace(/```(\s*)(\n|\r\n)/g, '```text$2')
      // 处理嵌套代码块
      .replace(/```([a-z]+)([\s\S]*?)```([\s\S]*?)```/g, (match, lang, code, rest) => {
        // 检查是否有嵌套的代码块
        if (rest.includes('```')) {
          // 将嵌套的代码块中的 ``` 替换为特殊标记
          const fixedCode = code.replace(/```/g, '\\```');
          return `\`\`\`${lang}${fixedCode}\`\`\`${rest}`;
        }
        return match;
      })
      // 确保代码块和标题之间有空行
      .replace(/```\s*\n(#+ )/g, '```\n\n$1')
      // 统一换行符
      .replace(/\r\n/g, '\n')
      // 确保列表项前有空行，这样可以确保列表被正确渲染
      .replace(/(^|\n)(?!\n)([\*\-\+]\s|\d+\.\s)/gm, '$1\n$2')
      // 确保列表项有正确的缩进和空格
      .replace(/(^|\n)([\*\-\+])(?!\s)/gm, '$1$2 ')
      .replace(/(^|\n)(\d+\.)(?!\s)/gm, '$1$2 ')
      // 特别处理 h1 标题，确保正确渲染
      .replace(/(^|\n)# ([^\n]+)/g, '$1<h1 class="bytemd-h1">$2</h1>');
      
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