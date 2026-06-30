import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderMarkdoc } from '@/lib/markdoc';

async function renderToDom(md: string) {
  const result = await renderMarkdoc(md);
  return render(<>{result}</>).container;
}

describe('markdoc — ids des headings', () => {
  it('slugifie le texte du titre (accents → ascii)', async () => {
    const c = await renderToDom('## Le déclic');
    expect(c.querySelector('h2')?.getAttribute('id')).toBe('le-declic');
  });

  it('retire ponctuation et apostrophes, garde les chiffres', async () => {
    const c = await renderToDom("## 2. La doc d'abord, les consignes ensuite");
    expect(c.querySelector('h2')?.getAttribute('id')).toBe(
      '2-la-doc-d-abord-les-consignes-ensuite',
    );
  });

  it('déduplique les titres identiques d’une même page', async () => {
    const c = await renderToDom('## Test\n\n## Test');
    const ids = [...c.querySelectorAll('h2')].map((h) => h.getAttribute('id'));
    expect(ids).toEqual(['test', 'test-2']);
  });

  it('retombe sur « section » si le titre ne produit aucun caractère', async () => {
    const c = await renderToDom('## ???');
    expect(c.querySelector('h2')?.getAttribute('id')).toBe('section');
  });
});
