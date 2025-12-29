import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import yaml from 'yaml';
import os from 'os';

export interface ProcessResult {
  success: boolean;
  slug: string;
  outputPath?: string;
  width?: number;
  height?: number;
  error?: string;
  skipped?: boolean;
}

const SUPPORTED_FORMATS = ['.heic', '.heif', '.jpg', '.jpeg', '.png', '.webp', '.tiff', '.raw', '.dng'];
const HEIC_FORMATS = ['.heic', '.heif'];

function findImageFile(dir: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (SUPPORTED_FORMATS.includes(ext)) {
      return path.join(dir, file);
    }
  }
  return null;
}

/**
 * Convert HEIC to JPEG using heif-convert CLI (libheif)
 * Returns the path to the converted JPEG file
 */
function convertHeicToJpeg(heicPath: string): string {
  const tempDir = os.tmpdir();
  const tempJpeg = path.join(tempDir, `heic-convert-${Date.now()}.jpg`);

  try {
    execSync(`heif-convert "${heicPath}" "${tempJpeg}"`, { stdio: 'pipe' });
    return tempJpeg;
  } catch (error) {
    throw new Error(`Failed to convert HEIC: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process a single photo entry
 * Keystatic structure: {slug}.yaml + {slug}/image.heic
 */
export async function processPhoto(
  yamlPath: string,
  outputDir: string
): Promise<ProcessResult> {
  const slug = path.basename(yamlPath, '.yaml');
  const contentDir = path.dirname(yamlPath);
  const imageDir = path.join(contentDir, slug);

  // Check if YAML exists
  if (!fs.existsSync(yamlPath)) {
    return {
      success: false,
      slug,
      error: 'No YAML file found',
    };
  }

  // Find image file in the slug subdirectory
  const imagePath = findImageFile(imageDir);
  if (!imagePath) {
    return {
      success: false,
      slug,
      error: 'No image found in directory',
    };
  }

  const outputPath = path.join(outputDir, `${slug}.webp`);
  let tempFile: string | null = null;

  try {
    // Check if HEIC format - needs conversion via heif-convert
    const ext = path.extname(imagePath).toLowerCase();
    let processPath = imagePath;

    if (HEIC_FORMATS.includes(ext)) {
      tempFile = convertHeicToJpeg(imagePath);
      processPath = tempFile;
    }

    // Get metadata first
    const metadata = await sharp(processPath).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // Convert to WebP with auto-rotation (strips EXIF after rotation)
    await sharp(processPath)
      .rotate() // Auto-rotate based on EXIF, then strip EXIF
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Update YAML with dimensions
    const yamlContent = yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
    yamlContent.width = width;
    yamlContent.height = height;
    fs.writeFileSync(yamlPath, yaml.stringify(yamlContent));

    return {
      success: true,
      slug,
      outputPath,
      width,
      height,
    };
  } catch (error) {
    return {
      success: false,
      slug,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  } finally {
    // Clean up temp file
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

export async function processAllPhotos(
  contentDir: string,
  outputDir: string
): Promise<ProcessResult[]> {
  // Check if content directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const results: ProcessResult[] = [];
  const entries = fs.readdirSync(contentDir);

  // Find all YAML files (Keystatic creates {slug}.yaml files)
  const yamlFiles = entries.filter((f) => f.endsWith('.yaml'));

  for (const yamlFile of yamlFiles) {
    const slug = path.basename(yamlFile, '.yaml');
    const yamlPath = path.join(contentDir, yamlFile);
    const outputPath = path.join(outputDir, `${slug}.webp`);

    // Check if already processed
    if (fs.existsSync(outputPath)) {
      const yamlContent = yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
      if (yamlContent.width && yamlContent.height) {
        results.push({
          success: true,
          slug,
          skipped: true,
          width: yamlContent.width,
          height: yamlContent.height,
        });
        continue;
      }
    }

    const result = await processPhoto(yamlPath, outputDir);
    results.push(result);
  }

  return results;
}

// CLI entry point
async function main() {
  const isProd = process.env.NODE_ENV === 'production';
  const contentDir = path.join(process.cwd(), isProd ? 'content/photos' : 'content/photos/local');
  const outputDir = path.join(process.cwd(), 'public/photos');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Processing photos...');
  const results = await processAllPhotos(contentDir, outputDir);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const result of results) {
    if (result.skipped) {
      skipped++;
      console.log(`  ⏭️  ${result.slug} (skipped)`);
    } else if (result.success) {
      processed++;
      console.log(`  ✅ ${result.slug} (${result.width}x${result.height})`);
    } else {
      failed++;
      console.log(`  ❌ ${result.slug}: ${result.error}`);
    }
  }

  console.log(`\nDone: ${processed} processed, ${skipped} skipped, ${failed} failed`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
