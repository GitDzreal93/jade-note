import { NextResponse } from 'next/server';
import { getDocsData, getDocContent } from '@/lib/docs';

export async function GET() {
  try {
    const docs = await getDocsData();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error in docs API:', error);
    return NextResponse.json({ error: 'Failed to fetch docs data' }, { status: 500 });
  }
}

// 新增搜索API
export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const docs = await getDocsData();
    const results = [];

    // 遍历所有文档
    for (const doc of docs) {
      // 搜索主文档
      const content = await getDocContent(doc.filename);
      if (content && (
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        content.toLowerCase().includes(query.toLowerCase())
      )) {
        results.push({
          title: doc.title,
          slug: doc.slug,
          preview: extractPreview(content, query),
          isParent: true
        });
      }

      // 搜索子文档
      if (doc.children) {
        for (const child of doc.children) {
          const childContent = await getDocContent(child.filename);
          if (childContent && (
            child.title.toLowerCase().includes(query.toLowerCase()) ||
            childContent.toLowerCase().includes(query.toLowerCase())
          )) {
            results.push({
              title: child.title,
              slug: child.slug,
              preview: extractPreview(childContent, query),
              parentTitle: doc.title,
              isParent: false
            });
          }
        }
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Failed to search docs' }, { status: 500 });
  }
}

// 提取匹配内容的预览
function extractPreview(content: string, query: string): string {
  const normalizedContent = content.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const index = normalizedContent.indexOf(normalizedQuery);
  
  if (index === -1) return '';
  
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);
  let preview = content.slice(start, end);
  
  if (start > 0) preview = '...' + preview;
  if (end < content.length) preview = preview + '...';
  
  return preview;
}
