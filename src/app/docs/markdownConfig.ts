import { ElementType } from 'react';

type MarkdownOverrideProps = {
  component: ElementType;
  props?: Record<string, any>;
};

// Markdown component style configurations
export const markdownOverrides: Record<string, MarkdownOverrideProps> = {
  a: {
    component: 'a',
    props: {
      className: 'text-emerald-600 hover:text-emerald-500'
    }
  },
  h1: {
    component: 'h1' as ElementType,
    props: {
      className: 'text-3xl font-bold mt-8 mb-4 text-gray-900'
    }
  },
  h2: {
    component: 'h2' as ElementType,
    props: {
      className: 'text-2xl font-bold mt-6 mb-3 text-gray-900'
    }
  },
  h3: {
    component: 'h3' as ElementType,
    props: {
      className: 'text-xl font-semibold mt-5 mb-2 text-gray-900'
    }
  },
  h4: {
    component: 'h4' as ElementType,
    props: {
      className: 'text-lg font-semibold mt-4 mb-2 text-gray-900'
    }
  },
  h5: {
    component: 'h5' as ElementType,
    props: {
      className: 'text-base font-semibold mt-3 mb-1 text-gray-900'
    }
  },
  h6: {
    component: 'h6' as ElementType,
    props: {
      className: 'text-sm font-semibold mt-3 mb-1 text-gray-900'
    }
  },
  p: {
    component: 'p' as ElementType,
    props: {
      className: 'my-4 text-gray-600 leading-relaxed'
    }
  },
  ul: {
    component: 'ul' as ElementType,
    props: {
      className: 'list-disc pl-6 my-4 text-gray-600'
    }
  },
  ol: {
    component: 'ol' as ElementType,
    props: {
      className: 'list-decimal pl-6 my-4 text-gray-600'
    }
  },
  li: {
    component: 'li' as ElementType,
    props: {
      className: 'mb-2'
    }
  },
  blockquote: {
    component: 'blockquote' as ElementType,
    props: {
      className: 'pl-4 border-l-4 border-emerald-500 italic text-gray-700 my-4'
    }
  },
  hr: {
    component: 'hr' as ElementType,
    props: {
      className: 'my-6 border-t border-gray-200'
    }
  },
  table: {
    component: 'table' as ElementType,
    props: {
      className: 'min-w-full divide-y divide-gray-200 my-6'
    }
  },
  thead: {
    component: 'thead' as ElementType,
    props: {
      className: 'bg-gray-50'
    }
  },
  th: {
    component: 'th' as ElementType,
    props: {
      className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
    }
  },
  tbody: {
    component: 'tbody' as ElementType,
    props: {
      className: 'bg-white divide-y divide-gray-200'
    }
  }
};
