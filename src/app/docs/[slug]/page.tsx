import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { findDocBySlug, getDocContent, getDocsData } from '@/lib/docs';

// Define simple page props interface that matches what Next.js provides
interface PageProps {
  params: any; // Use any to avoid type issues with the params object
}

export const metadata = {
  title: 'Jade Note 文档',
};

export default async function DocumentPage(props: PageProps) {
  try {
    // Get and process the slug safely using an immediately-invoked async function
    const normalizedSlug = await (async () => {
      // Get the raw slug value
      const paramsObj = await props.params;
      const rawSlug = paramsObj.slug;
      
      if (!rawSlug) {
        console.error('Invalid slug parameter');
        notFound();
      }
      
      // Process the slug
      const decodedSlug = decodeURIComponent(rawSlug);
      return decodedSlug.replace(/\/+/g, '/');
    })();
    
    // Find the document using the processed slug
    const docs = await getDocsData();
    
    // Function to find a document by slug
    const findDoc = (nodes: any[], targetSlug: string): any => {
      const doc = nodes.find(node => node.slug === targetSlug);
      if (doc) return doc;
      
      for (const node of nodes) {
        if (node.children?.length > 0) {
          const found = findDoc(node.children, targetSlug);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    const doc = findDoc(docs, normalizedSlug);
    
    if (!doc) {
      console.error('Document not found for slug:', normalizedSlug);
      notFound();
    }

    const content = await getDocContent(doc.filename);

    if (!content) {
      return (
        <article className="bg-white rounded-lg shadow-sm p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{doc.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(parseInt(doc.obj_edit_time) * 1000).toLocaleDateString()}
              </span>
            </div>
          </header>
          <div className="prose max-w-none">
            <p className="text-gray-600">文档内容不存在或正在编辑中</p>
          </div>
        </article>
      );
    }

    return (
      <article className="bg-white rounded-lg shadow-sm p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{doc.title}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {new Date(parseInt(doc.obj_edit_time) * 1000).toLocaleDateString()}
            </span>
            <span className="mx-2">·</span>
            <span className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4" />
              预计阅读时间 5 分钟
            </span>
          </div>
        </header>

        <div className="prose prose-emerald prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-500 prose-code:text-emerald-600 prose-code:bg-emerald-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 max-w-none">
          {content}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <HandThumbUpIcon className="mr-2 h-5 w-5" />
              点赞
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <BookmarkIcon className="mr-2 h-5 w-5" />
              收藏
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center text-gray-400 hover:text-gray-500">
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error in DocumentPage:', error);
    notFound();
  }
}
