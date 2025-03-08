import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { findDocBySlug, getDocContent, getDocsData } from '@/lib/docs';
import Markdown from 'markdown-to-jsx';

// Define simple page props interface that matches what Next.js provides
interface PageProps {
  params: any; // Use any to avoid type issues with the params object
}

export const metadata = {
  title: 'Jade Note 文档',
};

export default async function DocumentPage(props: PageProps) {
  try {
    console.log('开始处理文档页面请求...');
    // Get and process the slug safely using an immediately-invoked async function
    const normalizedSlug = await (async () => {
      console.log('开始处理 slug 参数...');
      // Get the raw slug value
      const paramsObj = await props.params;
      const rawSlug = paramsObj.slug;
      
      if (!rawSlug) {
        console.error('无效的 slug 参数');
        notFound();
      }
      
      // Process the slug
      const decodedSlug = decodeURIComponent(rawSlug);
      const processedSlug = decodedSlug.replace(/\/+/g, '/');
      console.log('处理后的 slug:', processedSlug);
      return processedSlug;
    })();
    
    console.log('开始查找文档数据...');
    // Find the document using the processed slug
    const docs = await getDocsData();
    const doc = await findDocBySlug(normalizedSlug);
    
    if (!doc) {
      console.error('未找到对应的文档:', normalizedSlug);
      notFound();
    }
    
    console.log('找到文档:', doc.title);

    console.log('开始获取文档内容...');
    const content = await getDocContent(doc.filename);
    console.log('文档内容获取状态:', content ? '成功' : '失败');

    if (!content) {
      console.log('文档内容为空，显示占位信息');
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
    
    console.log('开始渲染文档内容...');

    try {
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
            {content ? (
              <div className="mdx-content">
                <Markdown options={{
                  overrides: {
                    a: {
                      component: Link,
                      props: {
                        className: 'text-emerald-600 hover:text-emerald-500'
                      }
                    },
                    h1: {
                      component: 'h1',
                      props: {
                        className: 'text-3xl font-bold mt-8 mb-4 text-gray-900'
                      }
                    },
                    h2: {
                      component: 'h2',
                      props: {
                        className: 'text-2xl font-bold mt-6 mb-3 text-gray-900'
                      }
                    },
                    h3: {
                      component: 'h3',
                      props: {
                        className: 'text-xl font-semibold mt-5 mb-2 text-gray-900'
                      }
                    },
                    h4: {
                      component: 'h4',
                      props: {
                        className: 'text-lg font-semibold mt-4 mb-2 text-gray-900'
                      }
                    },
                    h5: {
                      component: 'h5',
                      props: {
                        className: 'text-base font-semibold mt-3 mb-1 text-gray-900'
                      }
                    },
                    h6: {
                      component: 'h6',
                      props: {
                        className: 'text-sm font-semibold mt-3 mb-1 text-gray-900'
                      }
                    },
                    p: {
                      component: 'p',
                      props: {
                        className: 'my-4 text-gray-600'
                      }
                    },
                    ul: {
                      component: 'ul',
                      props: {
                        className: 'list-disc pl-6 my-4 text-gray-600'
                      }
                    },
                    ol: {
                      component: 'ol',
                      props: {
                        className: 'list-decimal pl-6 my-4 text-gray-600'
                      }
                    },
                    li: {
                      component: 'li',
                      props: {
                        className: 'mb-1'
                      }
                    },
                    code: {
                      component: 'code',
                      props: {
                        className: 'bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded'
                      }
                    }
                  },
                  wrapper: React.Fragment
                }}>
                  {content}
                </Markdown>
              </div>
            ) : (
              <p className="text-gray-600">无法渲染文档内容，请稍后再试。</p>
            )}
          </div>
        </article>
      );
    } catch (renderError) {
      console.error('渲染 MDX 内容时出错:', renderError);
      logErrorSafely('MDX 渲染错误', renderError);
      return (
        <article className="bg-white rounded-lg shadow-sm p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">渲染错误</h1>
          </header>
          <div className="prose max-w-none">
            <p className="text-gray-600">抱歉，渲染文档内容时出现错误。请稍后再试。</p>
          </div>
        </article>
      );
    }
  } catch (error) {
    console.error('文档页面渲染错误:', error);
    const logErrorSafely = (prefix: string, err: unknown) => {
      console.error(`${prefix}:`, err);
      
      const errorInfo: Record<string, string> = {};
      
      if (err && typeof err === 'object') {
        if ('message' in err && err.message) {
          errorInfo.message = String(err.message);
        }
        
        if ('name' in err && err.name) {
          errorInfo.name = String(err.name);
        }
        
        if ('stack' in err && err.stack) {
          errorInfo.stack = String(err.stack).split('\n').slice(0, 3).join('\n');
        } else {
          errorInfo.stack = 'No stack trace available';
        }
      } else if (err !== null && err !== undefined) {
        errorInfo.value = String(err);
      } else {
        errorInfo.value = '未知错误 (null 或 undefined)';
      }
      
      console.error('错误详情:', errorInfo);
    };
    return (
      <article className="bg-white rounded-lg shadow-sm p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">加载错误</h1>
        </header>
        <div className="prose max-w-none">
          <p className="text-gray-600">抱歉，加载文档时出现错误。请稍后再试。</p>
        </div>
      </article>
    );
  }
}
