import Markdoc, { type Config } from '@markdoc/markdoc';
import React from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { createHighlighter, type Highlighter } from 'shiki';
import Image from 'next/image';
import { imageDimensions } from '@/lib/images';

const THEME = 'nord';
// Nord's comment color (#616e88) only reaches 2.43:1 on the code background
// (#2e3440), below WCAG AA. Lighten it to a tone that passes 4.5:1.
const COLOR_REPLACEMENTS: Record<string, string> = {
  '#616e88': '#9aa4bc',
  '#616E88': '#9aa4bc',
  // nord15 (violet) : 4.41:1 sur #2e3440, sous AA → éclairci à 5.06:1
  '#b48ead': '#be9ab8',
  '#B48EAD': '#be9ab8',
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

/**
 * A single image with an optional caption, rendered as a semantic <figure>.
 * width/height are injected at build time (see addImageDimensions) so next/image
 * reserves layout space (no CLS) and emits a responsive AVIF/WebP srcset.
 */
function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="article-figure">
      {src && width && height ? (
        <Image
          src={src}
          alt={alt ?? ''}
          width={width}
          height={height}
          sizes="(max-width: 640px) 100vw, 240px"
          className="h-auto w-full"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ''} loading="lazy" />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** Lays its child figures out in a responsive grid (2 columns, 1 on mobile). */
function Gallery({ children }: { children?: React.ReactNode }) {
  return <div className="img-grid">{children}</div>;
}

/**
 * Walk the transformed Markdoc tree and annotate each Figure with its source
 * width/height, so next/image can reserve layout space (no CLS) and emit a
 * responsive srcset. Markdoc's React renderer is synchronous, so dimensions
 * must be resolved here (async) before rendering.
 */
async function addImageDimensions(node: unknown): Promise<void> {
  if (Array.isArray(node)) {
    await Promise.all(node.map(addImageDimensions));
    return;
  }
  if (!node || typeof node !== 'object') return;
  const tag = node as { name?: string; attributes?: Record<string, unknown>; children?: unknown };
  if (tag.name === 'Figure' && typeof tag.attributes?.src === 'string') {
    const dims = await imageDimensions(tag.attributes.src);
    if (dims) {
      tag.attributes.width = dims.width;
      tag.attributes.height = dims.height;
    }
  }
  if (tag.children) await addImageDimensions(tag.children);
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
  await addImageDimensions(transformed);
  return Markdoc.renderers.react(transformed, React, { components: { CodeBlock, Figure, Gallery } });
}

/**
 * Server component: renders Markdoc content with Shiki highlighting.
 * Rendered on the server and passed as a prop to client components.
 */
export async function MarkdocContent({ content }: { content: string }) {
  return <>{await renderMarkdoc(content)}</>;
}
