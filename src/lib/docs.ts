import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';
import { cache } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';

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
    const docsPath = path.join(process.cwd(), 'docs', 'docs.json');
    const data = await readFile(docsPath, 'utf8');
    const docs = JSON.parse(data) as DocNode[];
    
    // Ensure docs are properly sorted by position at the root level
    return docs.sort((a, b) => a.position - b.position);
  } catch (error) {
    console.error('Error loading docs data:', error);
    return [];
  }
});

export const getDocContent = cache(async (filename: string) => {
  try {
    const filePath = path.join(process.cwd(), 'docs', filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const source = await readFile(filePath, 'utf8');
    
    // 编译 MDX 内容
    const { content } = await compileMDX({
      source,
      options: { parseFrontmatter: true }
    });

    return content;
  } catch (error) {
    console.error('Error loading doc content:', error);
    return null;
  }
});

export const findDocBySlug = cache(async (slug: string) => {
  const docs = await getDocsData();
  
  // 递归查找文档
  const findDoc = (nodes: DocNode[], targetSlug: string): DocNode | null => {
    // 在当前层级查找
    const doc = nodes.find(node => node.slug === targetSlug);
    if (doc) return doc;

    // 在子节点中查找
    for (const node of nodes) {
      if (node.children.length > 0) {
        const found = findDoc(node.children, targetSlug);
        if (found) return found;
      }
    }

    return null;
  };

  return findDoc(docs, slug);
});
