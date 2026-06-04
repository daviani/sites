import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderMarkdoc, MarkdocContent } from '@/lib/markdoc';

describe('markdoc', () => {
  describe('renderMarkdoc', () => {
    it('renders simple paragraph text', async () => {
      const result = await renderMarkdoc('Hello world');
      const { container } = render(<>{result}</>);
      expect(container.textContent).toContain('Hello world');
    });

    it('renders heading elements', async () => {
      const result = await renderMarkdoc('# Title');
      const { container } = render(<>{result}</>);
      const h1 = container.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toBe('Title');
    });

    it('renders multiple heading levels', async () => {
      const content = '# H1\n\n## H2\n\n### H3';
      const result = await renderMarkdoc(content);
      const { container } = render(<>{result}</>);
      expect(container.querySelector('h1')).not.toBeNull();
      expect(container.querySelector('h2')).not.toBeNull();
      expect(container.querySelector('h3')).not.toBeNull();
    });

    it('renders bold text', async () => {
      const result = await renderMarkdoc('This is **bold** text');
      const { container } = render(<>{result}</>);
      const strong = container.querySelector('strong');
      expect(strong).not.toBeNull();
      expect(strong?.textContent).toBe('bold');
    });

    it('renders italic text', async () => {
      const result = await renderMarkdoc('This is *italic* text');
      const { container } = render(<>{result}</>);
      const em = container.querySelector('em');
      expect(em).not.toBeNull();
      expect(em?.textContent).toBe('italic');
    });

    it('renders links', async () => {
      const result = await renderMarkdoc('[example](https://example.com)');
      const { container } = render(<>{result}</>);
      const link = container.querySelector('a');
      expect(link).not.toBeNull();
      expect(link?.getAttribute('href')).toBe('https://example.com');
      expect(link?.textContent).toBe('example');
    });

    it('renders unordered lists', async () => {
      const content = '- Item 1\n- Item 2\n- Item 3';
      const result = await renderMarkdoc(content);
      const { container } = render(<>{result}</>);
      const ul = container.querySelector('ul');
      expect(ul).not.toBeNull();
      const items = container.querySelectorAll('li');
      expect(items.length).toBe(3);
    });

    it('renders ordered lists', async () => {
      const content = '1. First\n2. Second\n3. Third';
      const result = await renderMarkdoc(content);
      const { container } = render(<>{result}</>);
      const ol = container.querySelector('ol');
      expect(ol).not.toBeNull();
    });

    it('renders code blocks with Shiki highlighting', async () => {
      const content = '```ts\nconst x = 1;\n```';
      const result = await renderMarkdoc(content);
      const { container } = render(<>{result}</>);
      const pre = container.querySelector('pre');
      expect(pre).not.toBeNull();
      expect(pre?.className).toContain('shiki');
      expect(pre?.textContent).toContain('const x = 1;');
    });

    it('renders inline code', async () => {
      const result = await renderMarkdoc('Use `console.log` here');
      const { container } = render(<>{result}</>);
      const code = container.querySelector('code');
      expect(code).not.toBeNull();
      expect(code?.textContent).toBe('console.log');
    });

    it('handles empty content', async () => {
      const result = await renderMarkdoc('');
      const { container } = render(<>{result}</>);
      expect(container).toBeDefined();
    });
  });

  describe('MarkdocContent', () => {
    it('renders content as React component', async () => {
      const ui = await MarkdocContent({ content: 'Hello from component' });
      const { container } = render(<>{ui}</>);
      expect(container.textContent).toContain('Hello from component');
    });

    it('renders complex markdown', async () => {
      const content = '# Title\n\nParagraph with **bold** and *italic*.\n\n- List item';
      const ui = await MarkdocContent({ content });
      const { container } = render(<>{ui}</>);
      expect(container.querySelector('h1')).not.toBeNull();
      expect(container.querySelector('strong')).not.toBeNull();
      expect(container.querySelector('em')).not.toBeNull();
      expect(container.querySelector('li')).not.toBeNull();
    });
  });
});
