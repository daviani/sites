import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-fg">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 text-fg">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-6 mb-3 text-fg">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-4 text-fg dark:text-fg-muted leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc text-fg dark:text-fg-muted">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal text-fg dark:text-fg-muted">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="my-1">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-fg-muted dark:text-accent hover:underline cursor-pointer"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 bg-surface-hi rounded text-sm font-mono text-fg">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-4 p-4 bg-surface dark:bg-bg rounded-lg overflow-x-auto border border-surface-hi">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 pl-4 border-l-4 border-accent italic text-fg dark:text-fg-muted">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-fg">{children}</strong>
    ),
    ...components,
  };
}
