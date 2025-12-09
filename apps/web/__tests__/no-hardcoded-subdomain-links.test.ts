import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { VALID_SUBDOMAINS } from '../lib/domains/config';

describe('No hardcoded subdomain links', () => {
  it('should not have hardcoded href to subdomains in app directory', async () => {
    const appDir = path.join(__dirname, '../app');
    const files = await glob('**/*.tsx', { cwd: appDir });

    const subdomainPattern = VALID_SUBDOMAINS.join('|');
    const hardcodedHrefRegex = new RegExp(
      `href=["']/(?:${subdomainPattern})(?:/|["'])`,
      'g'
    );

    const violations: { file: string; line: number; content: string }[] = [];

    for (const file of files) {
      const filePath = path.join(appDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (hardcodedHrefRegex.test(line)) {
          violations.push({
            file,
            line: index + 1,
            content: line.trim(),
          });
        }
        hardcodedHrefRegex.lastIndex = 0;
      });
    }

    if (violations.length > 0) {
      const message = violations
        .map((v) => `  ${v.file}:${v.line} → ${v.content}`)
        .join('\n');
      fail(
        `Found hardcoded subdomain links. Use getSubdomainUrl() instead:\n${message}`
      );
    }
  });
});