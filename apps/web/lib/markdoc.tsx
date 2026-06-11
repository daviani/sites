import Markdoc, { type Config } from '@markdoc/markdoc';
import React from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { createHighlighter, type Highlighter } from 'shiki';
import Image from 'next/image';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { imageDimensions } from '@/lib/images';
import { ILLUSTRATION_LABELS } from '@/lib/illustration-labels';

type Locale = 'fr' | 'en';

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
    illustration: {
      render: 'Illustration',
      attributes: {
        name: { type: String, required: true },
        alt: { type: String },
        caption: { type: String },
      },
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
 * Themed illustration, **inlined** as SVG (not <img>) so that:
 *  - its `--ill-*` colours inherit the Tulikettu tokens (bi-theme, no flash, no
 *    second file) — see the `.article-illustration` token map in globals.css;
 *  - its `data-i18n` labels are swapped for the article's locale (server-side);
 *  - axe-core sees the text and checks its contrast.
 * `svg` is resolved before render by inlineIllustrations(). The SVG is a local,
 * build-time asset we author — no user input — so dangerouslySetInnerHTML is safe.
 * role="img" + aria-label means screen readers announce the alt, not the inner text.
 */
function Illustration({ svg, alt, caption }: { svg?: string; alt?: string; caption?: string }) {
  if (!svg) return null;
  return (
    <figure className="article-figure article-illustration">
      <span
        role="img"
        aria-label={alt ?? ''}
        className="block w-full overflow-hidden rounded-2xl [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
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

const ILL_DIR = path.join(process.cwd(), 'public/images/blog/workflow-ia-2026');
const illustrationCache = new Map<string, string>();

/** Read a themed illustration SVG once, then cache it. */
async function readIllustration(name: string): Promise<string | null> {
  const cached = illustrationCache.get(name);
  if (cached !== undefined) return cached;
  try {
    const svg = await readFile(path.join(ILL_DIR, `${name}.svg`), 'utf8');
    illustrationCache.set(name, svg);
    return svg;
  } catch {
    return null;
  }
}

/**
 * Resolve each Illustration tag (async, before the sync renderer): load its
 * themed SVG, swap `data-i18n` text nodes for the locale's labels, and stash the
 * inline SVG string on the tag for the Illustration component to emit.
 */
async function inlineIllustrations(node: unknown, locale: Locale): Promise<void> {
  if (Array.isArray(node)) {
    await Promise.all(node.map((n) => inlineIllustrations(n, locale)));
    return;
  }
  if (!node || typeof node !== 'object') return;
  const tag = node as { name?: string; attributes?: Record<string, unknown>; children?: unknown };
  if (tag.name === 'Illustration' && typeof tag.attributes?.name === 'string') {
    const raw = await readIllustration(tag.attributes.name);
    if (raw) {
      const labels = ILLUSTRATION_LABELS[locale] ?? ILLUSTRATION_LABELS.fr;
      tag.attributes.svg = raw.replace(
        /(<text\b[^>]*\bdata-i18n="([^"]*)"[^>]*>)([\s\S]*?)(<\/text>)/g,
        (_m, open: string, key: string, content: string, close: string) =>
          `${open}${labels[key] ?? content}${close}`,
      );
    }
  }
  if (tag.children) await inlineIllustrations(tag.children, locale);
}

/**
 * Parse and render Markdoc content to React elements, with server-side
 * syntax highlighting for fenced code blocks via Shiki (Nord theme).
 *
 * Highlighting goes through Shiki's HAST output converted to real React
 * elements (no dangerouslySetInnerHTML, no HTML injection).
 */
export async function renderMarkdoc(content: string, locale: Locale = 'fr'): Promise<React.ReactNode> {
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
  await inlineIllustrations(transformed, locale);
  return Markdoc.renderers.react(transformed, React, { components: { CodeBlock, Figure, Gallery, Illustration } });
}

/**
 * Server component: renders Markdoc content with Shiki highlighting.
 * Rendered on the server and passed as a prop to client components.
 * `locale` drives the data-i18n label swap inside inlined illustrations.
 */
export async function MarkdocContent({ content, locale = 'fr' }: { content: string; locale?: Locale }) {
  return <>{await renderMarkdoc(content, locale)}</>;
}
