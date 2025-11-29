import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-nord-0 dark:text-nord-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 text-nord-0 dark:text-nord-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-6 mb-3 text-nord-0 dark:text-nord-6">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-4 text-nord-1 dark:text-nord-4 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc text-nord-1 dark:text-nord-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal text-nord-1 dark:text-nord-4">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="my-1">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-nord-3 dark:text-nord-8 hover:underline cursor-pointer"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 bg-nord-5 dark:bg-nord-2 rounded text-sm font-mono text-nord-0 dark:text-nord-6">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-4 p-4 bg-nord-1 dark:bg-nord-0 rounded-lg overflow-x-auto border border-nord-3 dark:border-nord-2">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 pl-4 border-l-4 border-nord-10 dark:border-nord-8 italic text-nord-0 dark:text-nord-4">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-nord-0 dark:text-nord-6">{children}</strong>
    ),
    ...components,
  };
}
