// Import removed: @bytemd/plugin-breaks not installed
import frontmatter from "@bytemd/plugin-frontmatter";
import gfm from "@bytemd/plugin-gfm";
import gfm_zhHans from "@bytemd/plugin-gfm/lib/locales/zh_Hans.json";
import highlightSSR from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import { type EditorProps } from "@bytemd/react";
import { merge } from "lodash-es";
import { common } from "lowlight";

// highlight需要额外扩充的高亮语言
import asciidoc from "highlight.js/lib/languages/asciidoc";
import dart from "highlight.js/lib/languages/dart";
import nginx from "highlight.js/lib/languages/nginx";

import { headingPlugin, prettyLinkPlugin } from "./plugins";

export const plugins = [
  // breaks plugin removed - not available
  frontmatter(),
  mediumZoom(),
  gfm({ locale: gfm_zhHans }),
  highlightSSR({
    languages: {
      // @bytemd/plugin-highlight-ssr 是基于 rehype-highlight 的封装
      // 而 rehype-highlight 是基于 lowlight 的封装
      // 使用 lowlight 中一个叫 common 的配置对象，这个对象包含了常用的预定义的语言高亮配置，如 js,ts,go,css等等
      // 为什么不导入全量的高亮语言配置是因为全量的配置太大了，只导入常用的语言高亮配置就够了，这样可以减少打包出来的体积
      ...common,

      // 默认common配置中没有以下几个语言高亮配置，这里我们自己加上
      dart: dart, // flutter代码会用到dart
      nginx: nginx, // nginx配置文件高亮
      asciidoc: asciidoc, // asciidoc高亮, 控制台输出信息高亮
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
