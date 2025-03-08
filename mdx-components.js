// This file is required to use @next/mdx in the `app` directory.
export function useMDXComponents(components) {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // You can add custom styling to MDX elements here
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold mb-4 mt-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-bold mb-3 mt-5" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-bold mb-3 mt-5" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-4" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 mb-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 mb-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),
    code: ({ children, ...props }) => (
      <code className="font-mono bg-gray-100 px-1 py-0.5 rounded" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4" {...props}>
        {children}
      </pre>
    ),
    a: ({ children, ...props }) => (
      <a className="text-blue-600 hover:underline" {...props}>
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props}>
        {children}
      </blockquote>
    ),
    ...components,
  };
}
