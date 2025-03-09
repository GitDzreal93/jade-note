/* eslint-disable */
// @ts-nocheck
import type { BytemdPlugin } from "bytemd";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { visit } from "unist-util-visit";

import { copyToClipboard, isBrowser } from "@/lib/utils";

const copyBtnNode = fromHtmlIsomorphic(`
<div class="copy-code-button">
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
</div>
`);

const clipboardCheckIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-check"><path d="m12 15 2 2 4-4"/><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const successTip = `<span style="font-size: 0.75em;">复制成功!</span>`;

// 语言别名映射
const languageAliases = {
  'ts': 'typescript',
  'js': 'javascript',
  'py': 'python',
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  'kt': 'kotlin',
  'golang': 'go'
};

/**
 * 插件功能
 * 1. 显示代码类型
 * 2. 增加复制代码按钮
 */
export const codeBlockPlugin = (): BytemdPlugin => {
  return {
    rehype: (process) =>
      process.use(() => (tree) => {
        visit(tree, "element", (node) => {
          if (node.tagName === "pre") {
            // 添加复制按钮
            node.children.push(copyBtnNode);
            
            // 确保 node.properties 存在
            if (!node.properties) {
              node.properties = {};
            }
            
            // 处理代码块的语言标记
            visit(node, "element", (code) => {
              if (code.tagName === "code") {
                // 获取语言类名
                const classNames = code.properties?.className || [];
                let language = null;
                
                // 从类名中提取语言
                for (const className of classNames) {
                  if (className.startsWith('language-')) {
                    language = className.replace('language-', '').split(':')[0];
                    break;
                  }
                }
                
                // 如果没有从类名中找到语言，尝试从代码内容中提取
                if (!language && code.children && code.children.length > 0) {
                  const firstLine = code.children[0].value;
                  if (firstLine && firstLine.startsWith('```')) {
                    const match = firstLine.match(/^```(\S+)/);
                    if (match) {
                      language = match[1];
                    }
                  }
                }
                
                // 处理语言别名
                if (language && languageAliases[language]) {
                  language = languageAliases[language];
                }
                
                // 如果没有找到语言标记，默认为text
                if (!language) {
                  language = 'text';
                }
                
                // 设置语言标记
                node.properties['data-lang'] = language;
                
                // 添加语言相关的类名
                if (!node.properties.className) {
                  node.properties.className = [];
                }
                if (!node.properties.className.includes(`language-${language}`)) {
                  node.properties.className.push(`language-${language}`);
                }
                
                // 确保代码元素也有正确的类名
                if (!code.properties.className) {
                  code.properties.className = [];
                }
                if (!code.properties.className.includes(`language-${language}`)) {
                  code.properties.className.push(`language-${language}`);
                }
                
                // 清理代码内容中的语言标记行
                if (code.children && code.children.length > 0) {
                  const firstLine = code.children[0].value;
                  if (firstLine && firstLine.startsWith('```')) {
                    code.children[0].value = firstLine.replace(/^```\S*\n/, '');
                  }
                }
              }
            });
          }
        });
      }),

    viewerEffect({ markdownBody }) {
      // 针对 SSR 场景适配
      if (!isBrowser()) {
        return;
      }

      const elements = markdownBody.querySelectorAll(".copy-code-button");
      for (const element of elements) {
        // 点击按钮复制代码到粘贴板
        element.addEventListener("click", () => {
          let codeText = element.textContent ?? "";
          // 复制代码时去除开头的$符号，然后trim一下，一般是复制shell命令的代码块会用到
          if (codeText.startsWith("$")) {
            codeText = codeText.slice(1).trim();
          }
          copyToClipboard(element.parentElement?.textContent?.trim() || "");

          const tmp = element.innerHTML;
          element.innerHTML = clipboardCheckIcon + successTip;
          let timer = 0;

          timer = window.setTimeout(() => {
            element.innerHTML = tmp;
            window.clearTimeout(timer);
            timer = 0;
          }, 3 * 1000);
        });
      }
    },
  };
};
