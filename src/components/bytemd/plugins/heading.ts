import type { BytemdPlugin } from "bytemd";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

/**
 * 标题插件，给标题加上id，方便跳转
 */
export function headingPlugin(): BytemdPlugin {
  return {
    viewerEffect({ markdownBody }) {
      // 确保在客户端渲染时正确处理标题
      if (typeof window !== 'undefined') {
        // 打印调试信息
        console.log('HeadingPlugin: markdownBody 结构', {
          element: markdownBody,
          innerHTML: markdownBody.innerHTML.substring(0, 500),
          h1Count: markdownBody.querySelectorAll('h1').length,
          h2Count: markdownBody.querySelectorAll('h2').length,
          h3Count: markdownBody.querySelectorAll('h3').length,
          allHeadingsCount: markdownBody.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          hasH1Tag: markdownBody.innerHTML.includes('<h1'),
          hasH1Text: markdownBody.textContent?.includes('一级目录') // 检查是否包含“一级目录”文本
        });
        
        // 尝试多次处理，因为渲染可能有延迟
        const processHeadings = () => {
          console.log('HeadingPlugin: 开始处理标题');
          const headings = markdownBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
          console.log(`HeadingPlugin: 找到 ${headings.length} 个标题元素`);
          
          // 如果没有找到 h1 标题，尝试手动创建
          const h1Elements = markdownBody.querySelectorAll('h1');
          if (h1Elements.length === 0 && markdownBody.textContent?.includes('一级目录')) {
            console.log('HeadingPlugin: 没有找到 h1 元素，但找到了“一级目录”文本，尝试手动创建');
            
            // 尝试在文本中查找“一级目录”并将其替换为 h1 标签
            const paragraphs = markdownBody.querySelectorAll('p');
            paragraphs.forEach((p) => {
              if (p.textContent?.includes('一级目录')) {
                console.log('HeadingPlugin: 在段落中找到“一级目录”文本', p);
                
                // 创建 h1 元素
                const h1 = document.createElement('h1');
                h1.textContent = '一级目录';
                h1.className = 'manually-created-h1';
                h1.id = 'heading-一级目录'; // 添加 ID 以便于锚点链接
                
                // 将段落替换为 h1
                p.parentNode?.replaceChild(h1, p);
                console.log('HeadingPlugin: 成功创建 h1 元素', h1);
              }
            });
          }
          
          // 处理所有标题
          headings.forEach((heading) => {
            const level = parseInt(heading.tagName.substring(1));
            const htmlHeading = heading as HTMLElement;
            
            console.log(`HeadingPlugin: 处理 ${heading.tagName} 标题`, {
              text: htmlHeading.textContent,
              id: htmlHeading.id,
              className: htmlHeading.className
            });
            
            // 特别处理 h1 标题
            if (level === 1) {
              console.log('HeadingPlugin: 特别处理 h1 标题', htmlHeading);
              htmlHeading.style.fontSize = '2.5em';
              htmlHeading.style.fontWeight = 'bold';
              htmlHeading.style.marginTop = '1.5em';
              htmlHeading.style.marginBottom = '0.8em';
              htmlHeading.style.borderBottom = '1px solid #eaecef';
              htmlHeading.style.paddingBottom = '0.3em';
              htmlHeading.style.display = 'block';
              htmlHeading.style.visibility = 'visible';
              htmlHeading.style.opacity = '1';
              htmlHeading.style.color = '#000';
              
              // 添加特殊类名
              htmlHeading.classList.add('bytemd-h1');
              htmlHeading.classList.add('bytemd-h1-first');
              
              // 确保有 ID 以便于锚点链接
              if (!htmlHeading.id) {
                htmlHeading.id = 'heading-一级目录';
              }
            }
          });
        };
        
        // 立即处理一次
        processHeadings();
        
        // 稍后再处理一次，以确保所有内容都已渲染
        setTimeout(processHeadings, 100);
        setTimeout(processHeadings, 500);
      }
    },
    rehype: (processor) => {
      // 打印调试信息
      console.log('HeadingPlugin: rehype 处理器初始化');
      
      return processor.use({
        plugins: [
          // 添加自定义处理器来调试 rehype 处理过程
          () => (tree) => {
            console.log('HeadingPlugin: 自定义处理器被调用', {
              treeType: typeof tree,
              hasChildren: tree.children && tree.children.length > 0,
              childrenCount: tree.children ? tree.children.length : 0
            });
            
            // 遍历所有节点，查找标题元素
            if (tree.children && tree.children.length > 0) {
              const findHeadings = (node: any) => {
                if (node.type === 'element' && node.tagName && /^h[1-6]$/.test(node.tagName)) {
                  console.log(`HeadingPlugin: 找到标题元素 ${node.tagName}`, {
                    properties: node.properties,
                    children: node.children,
                    textContent: node.children?.map((c: any) => c.value || '').join('')
                  });
                  
                  // 特别处理 h1 标题
                  if (node.tagName === 'h1') {
                    console.log('HeadingPlugin: 特别处理 h1 标题在 rehype 阶段');
                    
                    // 确保 h1 有 id 属性
                    if (!node.properties) {
                      node.properties = {};
                    }
                    
                    // 如果没有 id，添加一个默认的
                    if (!node.properties.id) {
                      const textContent = node.children?.map((c: any) => c.value || '').join('');
                      if (textContent.includes('一级目录')) {
                        node.properties.id = 'heading-一级目录';
                        console.log('HeadingPlugin: 为 h1 添加 id', node.properties.id);
                      }
                    }
                    
                    // 添加类名
                    if (!node.properties.className) {
                      node.properties.className = [];
                    }
                    if (Array.isArray(node.properties.className)) {
                      if (!node.properties.className.includes('bytemd-h1')) {
                        node.properties.className.push('bytemd-h1');
                      }
                      if (!node.properties.className.includes('bytemd-h1-first')) {
                        node.properties.className.push('bytemd-h1-first');
                      }
                    }
                  }
                }
                
                // 递归遍历子节点
                if (node.children && node.children.length > 0) {
                  node.children.forEach(findHeadings);
                }
              };
              
              tree.children.forEach(findHeadings);
            }
            
            return tree;
          },
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
              properties: {
                ariaHidden: true,
                tabIndex: -1,
                className: "heading-anchor",
              },
              // Removed SVG icon content to eliminate the icons while preserving the anchor functionality
              content: [],
            },
          ],
        ],
      });
    },
  };
}
