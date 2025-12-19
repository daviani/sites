import Markdoc from '@markdoc/markdoc';
import React from 'react';

/**
 * Parse and render Markdoc content to React elements
 */
export function renderMarkdoc(content: string): React.ReactNode {
  const ast = Markdoc.parse(content);
  const transformed = Markdoc.transform(ast);
  return Markdoc.renderers.react(transformed, React);
}

/**
 * Markdoc content component
 */
export function MarkdocContent({ content }: { content: string }) {
  const rendered = renderMarkdoc(content);
  return <>{rendered}</>;
}