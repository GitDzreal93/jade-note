// Import removed: @bytemd/plugin-breaks not installed
import frontmatter from "@bytemd/plugin-frontmatter";
import gfm from "@bytemd/plugin-gfm";
import gfm_zhHans from "@bytemd/plugin-gfm/lib/locales/zh_Hans.json";
import highlightSSR from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import { type EditorProps } from "@bytemd/react";
import { merge } from "lodash-es";
import { common } from "lowlight";

// 导入 highlight.js 样式
import 'highlight.js/styles/github.css';

// highlight需要额外扩充的高亮语言
import asciidoc from "highlight.js/lib/languages/asciidoc";
import dart from "highlight.js/lib/languages/dart";
import nginx from "highlight.js/lib/languages/nginx";
import typescript from "highlight.js/lib/languages/typescript"; // 添加 TypeScript 支持

import { headingPlugin, prettyLinkPlugin } from "./plugins";

// 添加调试日志
const debugHighlight = {
  preprocess: (code: string, lang: string | null) => {
    console.log('Debug: 代码高亮预处理', { code, lang });
    return code;
  },
  postprocess: (html: string) => {
    console.log('Debug: 代码高亮后处理', { html });
    return html;
  }
};

export const plugins = [
  frontmatter(),
  mediumZoom(),
  gfm({ locale: gfm_zhHans }),
  highlightSSR({
    languages: {
      ...common,
      typescript, // 显式添加 TypeScript 支持
      ts: typescript, // TypeScript 的别名
      tsx: typescript, // TSX 的支持
      dart,
      nginx,
      asciidoc,
    },
  }),
  prettyLinkPlugin(),
  headingPlugin(),
];

export const sanitize: EditorProps["sanitize"] = (schema) => {
  // 打印原始 schema 以便于调试
  console.log('Debug: 原始 sanitize schema', schema);
  
  const customerSchema = merge(schema, {
    // 添加允许的 HTML 标签
    tagNames: [
      "iframe", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr", "a", "img", "pre", "code", "ul", "ol", "li",
      "blockquote", "table", "thead", "tbody", "tr", "th", "td"
    ],
    attributes: {
      // 允许所有元素使用 style 和 class 属性
      "*": ["style", "class", "id"],
      // iframe 特殊属性
      iframe: [
        "src",
        "style",
        "title",
        "all",
        "sandbox",
        "scrolling",
        "border",
        "frameborder",
        "framespacing",
        "allowfullscreen",
        "width",
        "height",
        "allow",
      ],
      // 链接属性
      a: ["href", "title", "target", "rel"],
      // 图片属性
      img: ["src", "alt", "title", "width", "height"],
    },
  } as typeof schema);
  
  // 打印合并后的 schema 以便于调试
  console.log('Debug: 合并后的 sanitize schema', customerSchema);
  
  return customerSchema;
};
