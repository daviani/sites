const fs = require('fs');
const path = require('path');

describe('@daviani/config - TypeScript configurations', () => {
  const configDir = path.join(__dirname, '../typescript');

  describe('Configuration files exist', () => {
    test('base.json exists', () => {
      const configPath = path.join(configDir, 'base.json');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('nextjs.json exists', () => {
      const configPath = path.join(configDir, 'nextjs.json');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('react-library.json exists', () => {
      const configPath = path.join(configDir, 'react-library.json');
      expect(fs.existsSync(configPath)).toBe(true);
    });
  });

  describe('Configuration files are valid JSON', () => {
    test('base.json is valid JSON', () => {
      const configPath = path.join(configDir, 'base.json');
      const content = fs.readFileSync(configPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('nextjs.json is valid JSON', () => {
      const configPath = path.join(configDir, 'nextjs.json');
      const content = fs.readFileSync(configPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('react-library.json is valid JSON', () => {
      const configPath = path.join(configDir, 'react-library.json');
      const content = fs.readFileSync(configPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('Configuration inheritance', () => {
    test('nextjs.json extends base.json', () => {
      const configPath = path.join(configDir, 'nextjs.json');
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);
      expect(config.extends).toBe('./base.json');
    });

    test('react-library.json extends base.json', () => {
      const configPath = path.join(configDir, 'react-library.json');
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);
      expect(config.extends).toBe('./base.json');
    });
  });

  describe('Configuration content validation', () => {
    test('base.json has required compilerOptions', () => {
      const configPath = path.join(configDir, 'base.json');
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);

      expect(config.compilerOptions).toBeDefined();
      expect(config.compilerOptions.strict).toBe(true);
      expect(config.compilerOptions.esModuleInterop).toBe(true);
      expect(config.compilerOptions.skipLibCheck).toBe(true);
    });

    test('nextjs.json has Next.js specific options', () => {
      const configPath = path.join(configDir, 'nextjs.json');
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);

      expect(config.compilerOptions).toBeDefined();
      expect(config.compilerOptions.jsx).toBe('preserve');
      expect(config.compilerOptions.lib).toContain('dom');
    });

    test('react-library.json has React library specific options', () => {
      const configPath = path.join(configDir, 'react-library.json');
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);

      expect(config.compilerOptions).toBeDefined();
      expect(config.compilerOptions.jsx).toBe('react-jsx');
      expect(config.compilerOptions.lib).toContain('DOM');
    });
  });
});
