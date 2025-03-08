import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';
import { cache } from 'react';

export interface DocNode {
  depth: number;
  title: string;
  node_token: string;
  parent_node_token: string;
  obj_create_time: string;
  obj_edit_time: string;
  obj_token: string;
  children: DocNode[];
  has_child: boolean;
  slug: string;
  position: number;
  filename: string;
}

export interface PageParams {
  slug: string | string[];
}

// Helper function to safely get slug from params
export async function getSlugFromParams(params: any): Promise<string> {
  try {
    // In Next.js 15, we need to await params before accessing its properties
    const awaitedParams = await params;
    
    if (!awaitedParams || !awaitedParams.slug) {
      throw new Error('Invalid or missing slug parameter');
    }
    
    // Handle both string and array formats
    const rawSlug = Array.isArray(awaitedParams.slug)
      ? awaitedParams.slug.join('/')
      : awaitedParams.slug;
      
    // Process the slug to handle multi-level routes
    const decodedSlug = decodeURIComponent(rawSlug);
    const normalizedSlug = decodedSlug.replace(/\/+/g, '/');
    
    return normalizedSlug;
  } catch (error) {
    console.error('Error processing slug from params:', error);
    throw error;
  }
}

export const getDocsData = cache(async () => {
  try {
    console.log('开始加载文档数据...');
    const docsPath = path.join(process.cwd(), 'docs', 'docs.json');
    console.log('文档路径:', docsPath);
    
    if (!fs.existsSync(docsPath)) {
      console.error('docs.json 文件不存在:', docsPath);
      return [];
    }
    
    const data = await readFile(docsPath, 'utf8');
    console.log('成功读取 docs.json 文件');
    
    if (!data) {
      console.error('docs.json 文件为空');
      return [];
    }
    
    try {
      console.log('开始解析 docs.json 数据...');
      const docs = JSON.parse(data) as DocNode[];
      
      if (!Array.isArray(docs)) {
        console.error('无效的 docs.json 格式: 根节点必须是数组');
        return [];
      }
      
      console.log('文档数据解析成功，文档数量:', docs.length);
      // Ensure docs are properly sorted by position at the root level
      return docs.sort((a, b) => a.position - b.position);
    } catch (parseError) {
      console.error('解析 docs.json 时出错:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error loading docs data:', error);
    return [];
  }
});

export const getDocContent = cache(async (filename: string) => {
  try {
    console.log('开始获取文档内容, 文件名:', filename);
    const filePath = path.join(process.cwd(), 'docs', filename);
    console.log('文档完整路径:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('文件不存在:', filePath);
      return null;
    }
    
    console.log('开始读取文件内容...');
    const source = await readFile(filePath, 'utf8');
    console.log('文件内容读取成功, 内容长度:', source.length);
    
    // 对 MDX 内容进行预处理，确保其能正确渲染
    // 处理代码块的格式，确保可以正确识别语言
    const processedSource = source
      // 确保代码块的格式正确，如果没有指定语言，则添加空语言标识符
      .replace(/```(\s*)(\n|\r\n)/g, '```text$2')
      // 解决可能的空行在代码块中的问题
      .replace(/```(\w+)\s*\n\s*\n/g, '```$1\n')
      // 确保换行符一致性
      .replace(/\r\n/g, '\n');
      
    console.log('内容预处理完成');
    
    // 返回处理后的 MDX 内容
    return processedSource;
  } catch (error) {
    console.error('Error loading doc content:', error);
    return null;
  }
});

export const findDocBySlug = cache(async (slug: string) => {
  console.log('开始根据 slug 查找文档:', slug);
  const docs = await getDocsData();
  console.log('获取到文档数据, 开始查找...');
  
  // 递归查找文档
  const findDoc = (nodes: DocNode[], targetSlug: string): DocNode | null => {
    console.log('在当前层级查找文档, 目标 slug:', targetSlug);
    // 在当前层级查找
    const doc = nodes.find(node => node.slug === targetSlug);
    if (doc) {
      console.log('找到匹配的文档:', doc.title);
      return doc;
    }

    // 在子节点中查找
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        console.log('在子节点中继续查找, 当前节点:', node.title);
        const found = findDoc(node.children, targetSlug);
        if (found) return found;
      }
    }

    return null;
  };

  const result = findDoc(docs, slug);
  if (!result) {
    console.log('未找到匹配的文档');
  }
  return result;
});
