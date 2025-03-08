import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { findDocBySlug, getDocContent, getDocsData, getSlugFromParams } from '@/lib/docs';
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
    console.log('开始处理文档路由:', props.params);

    // 处理路径
    let slug: string;
    if (Array.isArray(props.params.slug)) {
      slug = props.params.slug.join('/');
    } else {
      slug = props.params.slug;
    }

    if (!slug) {
      console.log('缺少 slug 参数');
      notFound();
    }

    // 规范化路径
    const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
    console.log('规范化后的路径:', {
      originalSlug: props.params.slug,
      processedSlug: slug,
      normalizedSlug
    });
    
    // 查找文档
    const docs = await getDocsData();
    console.log('获取到文档数据:', docs.map(d => ({
      title: d.title,
      slug: d.slug,
      hasChildren: d.children?.length > 0,
      children: d.children?.map(c => ({ 
        title: c.title, 
        slug: c.slug,
        filename: c.filename
      }))
    })));

    const doc = await findDocBySlug(normalizedSlug);
    console.log('查找文档结果:', doc ? {
      title: doc.title,
      slug: doc.slug,
      filename: doc.filename,
      hasChildren: doc.children?.length > 0,
      path: doc.filename.replace(/^\/+|\/+$/g, '')
    } : '未找到文档');
    
    if (!doc) {
      console.log('未找到文档，返回 404');
      notFound();
    }
    
    // 检查文档类型
    const isChildDoc = doc.filename.includes('/');
    console.log('检查文档类型:', {
      filename: doc.filename,
      isChildDoc,
      path: doc.filename.replace(/^\/+|\/+$/g, '')
    });
    
    // 规范化文件路径
    const normalizedPath = doc.filename.replace(/^\/+|\/+$/g, '');
    console.log('尝试读取文档内容:', {
      filename: doc.filename,
      normalizedPath,
      isChildDoc
    });
    
    const content = await getDocContent(normalizedPath);
    console.log('文档内容读取结果:', {
      path: normalizedPath,
      hasContent: !!content,
      contentLength: content?.length
    });

    if (!content) {
      return (
        <article className="bg-white rounded-lg shadow-sm p-6">
          <header className="mb-8">
            {isChildDoc && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href={`/docs/${doc.slug.split('/')[0]}`} className="hover:text-emerald-600 flex items-center">
                  <ChevronRightIcon className="h-4 w-4 mr-1" />
                  返回上级
                </Link>
              </div>
            )}
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
            <p className="text-gray-500">文件路径: {normalizedPath}</p>
          </div>
        </article>
      );
    }
    

    try {
      return (
        <article className="bg-white rounded-lg shadow-sm p-6">
          <header className="mb-8">
            {isChildDoc && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href={`/docs/${doc.slug.split('/')[0]}`} className="hover:text-emerald-600 flex items-center">
                  <ChevronRightIcon className="h-4 w-4 mr-1" />
                  返回上级
                </Link>
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{doc.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(parseInt(doc.obj_edit_time) * 1000).toLocaleDateString()}
              </span>
              <span className="mx-2">·</span>
              <span className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                预计阅读时间 {Math.ceil((content?.length || 0) / 500)} 分钟
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
                      component: ({ href, ...props }) => {
                        // 检查是否是内部文档链接
                        if (href?.startsWith('/docs/')) {
                          return (
                            <Link
                              href={href}
                              className="text-emerald-600 hover:text-emerald-500 inline-flex items-center"
                              {...props}
                            />
                          );
                        }
                        // 外部链接
                        return (
                          <a
                            href={href}
                            className="text-emerald-600 hover:text-emerald-500"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        );
                      },
                      props: {}
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
      console.error('错误详情:', {
        name: renderError instanceof Error ? renderError.name : 'Unknown',
        message: renderError instanceof Error ? renderError.message : String(renderError)
      });
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
    console.error('文档页面渲染错误:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3).join('\n') : undefined
    });
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
