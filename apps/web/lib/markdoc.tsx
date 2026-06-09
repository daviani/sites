import Markdoc, { type Config } from '@markdoc/markdoc';
import React from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { createHighlighter, type Highlighter } from 'shiki';

const THEME = 'nord';
// Nord's comment color (#616e88) only reaches 2.43:1 on the code background
// (#2e3440), below WCAG AA. Lighten it to a tone that passes 4.5:1.
const COLOR_REPLACEMENTS: Record<string, string> = {
  '#616e88': '#9aa4bc',
  '#616E88': '#9aa4bc',
};
const LANGS = [
  'yaml',
  'typescript',
  'tsx',
  'javascript',
  'jsx',
  'bash',
  'json',
  'css',
  'html',
  'markdown',
  'swift',
];

let highlighterPromise: Promise<Highlighter> | undefined;

/** Lazily create a single shared Shiki highlighter (Nord theme). */
function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({ themes: [THEME], langs: LANGS });
  return highlighterPromise;
}

const config: Config = {
  nodes: {
    fence: {
      render: 'CodeBlock',
      attributes: {
        content: { type: String },
        language: { type: String },
      },
    },
  },
  tags: {
    figure: {
      render: 'Figure',
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        caption: { type: String },
      },
    },
    gallery: {
      render: 'Gallery',
    },
  },
};

/** A single image with an optional caption, rendered as a semantic <figure>. */
function Figure({ src, alt, caption }: { src?: string; alt?: string; caption?: string }) {
  return (
    <figure className="article-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ''} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** Lays its child figures out in a responsive grid (2 columns, 1 on mobile). */
function Gallery({ children }: { children?: React.ReactNode }) {
  return <div className="img-grid">{children}</div>;
}

/**
 * Parse and render Markdoc content to React elements, with server-side
 * syntax highlighting for fenced code blocks via Shiki (Nord theme).
 *
 * Highlighting goes through Shiki's HAST output converted to real React
 * elements (no dangerouslySetInnerHTML, no HTML injection).
 */
export async function renderMarkdoc(content: string): Promise<React.ReactNode> {
  const highlighter = await getHighlighter();

  const CodeBlock = ({ content: code, language }: { content?: string; language?: string }) => {
    const source = (code ?? '').replace(/\n$/, '');
    let hast;
    try {
      hast = highlighter.codeToHast(source, {
        lang: language || 'text',
        theme: THEME,
        colorReplacements: COLOR_REPLACEMENTS,
      });
    } catch {
      hast = highlighter.codeToHast(source, {
        lang: 'text',
        theme: THEME,
        colorReplacements: COLOR_REPLACEMENTS,
      });
    }
    return toJsxRuntime(hast, { Fragment, jsx, jsxs }) as React.ReactElement;
  };

  const ast = Markdoc.parse(content);
  const transformed = Markdoc.transform(ast, config);
  return Markdoc.renderers.react(transformed, React, { components: { CodeBlock, Figure, Gallery } });
}

/**
 * Server component: renders Markdoc content with Shiki highlighting.
 * Rendered on the server and passed as a prop to client components.
 */
export async function MarkdocContent({ content }: { content: string }) {
  return <>{await renderMarkdoc(content)}</>;
}
