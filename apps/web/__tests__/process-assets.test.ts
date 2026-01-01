import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import {
  processPhoto,
  processAllPhotos,
  type ProcessResult,
} from '@/scripts/process-assets';

// Mock Sharp
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    rotate: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(undefined),
    metadata: jest.fn().mockResolvedValue({ width: 4032, height: 3024 }),
  }));
});

describe('process-photos', () => {
  const testDir = path.join(__dirname, '__fixtures__/photos-test');
  const outputDir = path.join(__dirname, '__fixtures__/photos-output');

  beforeEach(() => {
    // Create test directories
    fs.mkdirSync(testDir, { recursive: true });
    fs.mkdirSync(outputDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  describe('processPhoto', () => {
    it('should convert image to WebP', async () => {
      // Keystatic structure: {slug}.yaml + {slug}/image.jpg (using JPG to avoid heif-convert)
      const yamlPath = path.join(testDir, 'test-photo.yaml');
      const imageDir = path.join(testDir, 'test-photo');
      fs.mkdirSync(imageDir, { recursive: true });
      fs.writeFileSync(path.join(imageDir, 'image.jpg'), 'fake image data');
      fs.writeFileSync(yamlPath, yaml.stringify({ title: 'Test Photo' }));

      const result = await processPhoto(yamlPath, outputDir);

      expect(result.success).toBe(true);
      expect(result.outputPath).toContain('.webp');
    });

    it('should extract correct dimensions', async () => {
      const yamlPath = path.join(testDir, 'test-photo.yaml');
      const imageDir = path.join(testDir, 'test-photo');
      fs.mkdirSync(imageDir, { recursive: true });
      fs.writeFileSync(path.join(imageDir, 'image.jpg'), 'fake image data');
      fs.writeFileSync(yamlPath, yaml.stringify({ title: 'Test Photo' }));

      const result = await processPhoto(yamlPath, outputDir);

      expect(result.width).toBe(4032);
      expect(result.height).toBe(3024);
    });

    it('should update YAML with dimensions', async () => {
      const yamlPath = path.join(testDir, 'test-photo.yaml');
      const imageDir = path.join(testDir, 'test-photo');
      fs.mkdirSync(imageDir, { recursive: true });
      fs.writeFileSync(path.join(imageDir, 'image.jpg'), 'fake image data');
      fs.writeFileSync(yamlPath, yaml.stringify({ title: 'Test Photo' }));

      await processPhoto(yamlPath, outputDir);

      const updatedYaml = yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
      expect(updatedYaml.width).toBe(4032);
      expect(updatedYaml.height).toBe(3024);
    });

    it('should handle missing image gracefully', async () => {
      const yamlPath = path.join(testDir, 'empty-photo.yaml');
      fs.writeFileSync(yamlPath, yaml.stringify({ title: 'Empty Photo' }));
      // No image directory created

      const result = await processPhoto(yamlPath, outputDir);

      expect(result.success).toBe(false);
      expect(result.error).toContain('No image found');
    });

    it('should handle various image formats', async () => {
      const yamlPath = path.join(testDir, 'jpeg-photo.yaml');
      const imageDir = path.join(testDir, 'jpeg-photo');
      fs.mkdirSync(imageDir, { recursive: true });
      fs.writeFileSync(path.join(imageDir, 'image.jpg'), 'fake image data');
      fs.writeFileSync(yamlPath, yaml.stringify({ title: 'JPEG Photo' }));

      const result = await processPhoto(yamlPath, outputDir);

      expect(result.success).toBe(true);
    });
  });

  describe('processAllPhotos', () => {
    it('should return empty array when no photos', async () => {
      const results = await processAllPhotos(testDir, outputDir);

      expect(results).toEqual([]);
    });

    it('should process all photos in directory', async () => {
      // Create multiple test photos (Keystatic structure, using JPG)
      for (let i = 1; i <= 3; i++) {
        const yamlPath = path.join(testDir, `photo-${i}.yaml`);
        const imageDir = path.join(testDir, `photo-${i}`);
        fs.mkdirSync(imageDir, { recursive: true });
        fs.writeFileSync(path.join(imageDir, 'image.jpg'), 'fake image data');
        fs.writeFileSync(yamlPath, yaml.stringify({ title: `Photo ${i}` }));
      }

      const results = await processAllPhotos(testDir, outputDir);

      expect(results).toHaveLength(3);
      expect(results.every((r: ProcessResult) => r.success)).toBe(true);
    });

    it('should skip already processed photos', async () => {
      const yamlPath = path.join(testDir, 'processed-photo.yaml');
      const imageDir = path.join(testDir, 'processed-photo');
      fs.mkdirSync(imageDir, { recursive: true });
      fs.writeFileSync(path.join(imageDir, 'image.jpg'), 'fake image data');
      fs.writeFileSync(yamlPath, yaml.stringify({
        title: 'Processed Photo',
        width: 4032,
        height: 3024
      }));

      // Also create the output file
      fs.writeFileSync(path.join(outputDir, 'processed-photo.webp'), 'fake webp');

      const results = await processAllPhotos(testDir, outputDir);

      expect(results).toHaveLength(1);
      expect(results[0].skipped).toBe(true);
    });
  });
});
