import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { findDocBySlug, getDocContent, getDocsData } from '@/lib/docs';
import Markdown from 'markdown-to-jsx';
import { markdownOverrides } from '../markdownConfig';

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
      const paramsObj = await props.params;
      const rawSlug = paramsObj.slug;
      
      if (!rawSlug) {
        notFound();
      }
      
      // Process the slug
      const decodedSlug = decodeURIComponent(rawSlug);
      return decodedSlug.replace(/\/+/g, '/');
    })();
    
    // Find the document using the processed slug
    const docs = await getDocsData();
    const doc = await findDocBySlug(normalizedSlug);
    
    if (!doc) {
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

          <div className="prose prose-emerald prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-500 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:text-gray-800 prose-pre:shadow-lg prose-img:rounded-lg prose-img:shadow-md max-w-none">
            {content ? (
              <div className="mdx-content">
                <Markdown options={{
                  overrides: {
                    ...markdownOverrides,
                    // Override the 'a' component to use Next.js Link
                    a: {
                      component: Link,
                      props: {
                        className: 'text-emerald-600 hover:text-emerald-500'
                      }
                    },
                    tr: {
                      component: 'tr',
                      props: {
                        className: 'hover:bg-gray-50'
                      }
                    },
                    td: {
                      component: 'td',
                      props: {
                        className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                      }
                    },
                    code: {
                      component: 'code',
                      props: {
                        className: 'font-mono bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm'
                      }
                    },
                    pre: {
                      component: ({ children, ...props }) => {
                        // Check if the child is a code element
                        const isCodeBlock = React.Children.toArray(children).some(
                          child => React.isValidElement(child) && child.type === 'code'
                        );

                        if (isCodeBlock) {
                          const codeElement = React.Children.toArray(children).find(
                            child => React.isValidElement(child) && child.type === 'code'
                          ) as React.ReactElement;

                          // Ensure type safety by explicitly typing props
                          const codeProps = codeElement?.props as Record<string, any>;
                          
                          const codeContent = React.isValidElement(codeElement) 
                            ? React.Children.toArray(codeProps.children) 
                            : [];

                          // Try to detect language from className (e.g. language-javascript)
                          const codeClass = codeProps.className || '';
                          const languageMatch = codeClass.match(/language-([\w-]+)/);
                          const language = languageMatch ? languageMatch[1] : '';
                          const displayLanguage = language ? language : 'code';

                          return (
                            <div className="bg-white rounded-lg shadow-lg my-4 overflow-hidden border border-gray-200">
                              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                  <CodeBracketIcon className="h-4 w-4 text-gray-500" />
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-mono">
                                    {displayLanguage}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {/* Code action buttons could be added here */}
                                </div>
                              </div>
                              <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto bg-gray-50">
                                {codeElement}
                              </div>
                            </div>
                          );
                        }

                        // Regular pre element, not a code block
                        return <pre {...props}>{children}</pre>;
                      }
                    },
                    img: {
                      component: 'img',
                      props: {
                        className: 'max-w-full h-auto rounded-lg shadow-md my-4'
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
