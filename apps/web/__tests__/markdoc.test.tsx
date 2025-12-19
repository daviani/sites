/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { renderMarkdoc, MarkdocContent } from '@/lib/markdoc';

describe('Markdoc Rendering', () => {
  describe('renderMarkdoc', () => {
    it('renders heading elements', () => {
      const content = '# Heading 1\n\n## Heading 2\n\n### Heading 3';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3');
    });

    it('renders paragraphs', () => {
      const content = 'This is a paragraph.\n\nThis is another paragraph.';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
      expect(screen.getByText('This is another paragraph.')).toBeInTheDocument();
    });

    it('renders unordered lists', () => {
      const content = '- Item 1\n- Item 2\n- Item 3';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders ordered lists', () => {
      const content = '1. First\n2. Second\n3. Third';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('OL');
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('renders code blocks', () => {
      const content = '```javascript\nconst x = 1;\n```';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      // Fenced code blocks render as <pre> elements
      const pre = document.querySelector('pre');
      expect(pre).toBeInTheDocument();
      expect(pre).toHaveAttribute('data-language', 'javascript');
      expect(screen.getByText(/const x = 1/)).toBeInTheDocument();
    });

    it('renders inline code', () => {
      const content = 'Use `const` for constants.';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      const code = screen.getByRole('code');
      expect(code).toHaveTextContent('const');
    });

    it('renders blockquotes', () => {
      const content = '> This is a quote';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      expect(screen.getByRole('blockquote')).toBeInTheDocument();
      expect(screen.getByText('This is a quote')).toBeInTheDocument();
    });

    it('renders bold text', () => {
      const content = 'This is **bold** text.';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      const strong = document.querySelector('strong');
      expect(strong).toBeInTheDocument();
      expect(strong).toHaveTextContent('bold');
    });

    it('renders italic text', () => {
      const content = 'This is *italic* text.';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      const em = document.querySelector('em');
      expect(em).toBeInTheDocument();
      expect(em).toHaveTextContent('italic');
    });

    it('renders links', () => {
      const content = 'Visit [Google](https://google.com) for search.';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      const link = screen.getByRole('link', { name: 'Google' });
      expect(link).toHaveAttribute('href', 'https://google.com');
    });

    it('handles empty content', () => {
      const content = '';
      const result = renderMarkdoc(content);

      const { container } = render(<>{result}</>);
      expect(container).toBeInTheDocument();
    });

    it('renders nested lists', () => {
      const content = '- Parent\n  - Child 1\n  - Child 2';
      const result = renderMarkdoc(content);

      render(<>{result}</>);

      expect(screen.getByText('Parent')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
    });
  });

  describe('MarkdocContent component', () => {
    it('renders content as React elements', () => {
      render(<MarkdocContent content="# Hello World" />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World');
    });

    it('renders multiple elements', () => {
      const content = '# Title\n\nParagraph text.\n\n- List item';
      render(<MarkdocContent content={content} />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Paragraph text.')).toBeInTheDocument();
      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('handles content with special characters', () => {
      const content = 'Code: `<div>` and `{}`';
      render(<MarkdocContent content={content} />);

      expect(screen.getByText('<div>')).toBeInTheDocument();
    });

    it('renders code with language hint', () => {
      const content = '```tsx\nfunction App() { return <div />; }\n```';
      render(<MarkdocContent content={content} />);

      // Fenced code blocks render as <pre> with language attribute
      const pre = document.querySelector('pre');
      expect(pre).toBeInTheDocument();
      expect(pre).toHaveAttribute('data-language', 'tsx');
    });
  });
});