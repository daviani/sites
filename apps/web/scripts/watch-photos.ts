import fs from 'fs';
import path from 'path';
import { processPhoto } from './process-photos';

// Dev uses content/photos/local, prod uses content/photos
const contentDir = path.join(process.cwd(), 'content/photos/local');
const outputDir = path.join(process.cwd(), 'public/photos');

// Ensure directories exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Watching for new photos in content/photos/local/...');
console.log('Ready. Add a photo via Keystatic...\n');

// Track processed files to avoid duplicates
const processed = new Set<string>();

// Process a photo
async function handlePhoto(filename: string) {
  if (!filename.endsWith('.yaml')) return;

  const yamlPath = path.join(contentDir, filename);
  const slug = path.basename(filename, '.yaml');

  // Skip if already processed recently
  if (processed.has(slug)) return;
  processed.add(slug);

  // Remove from processed after 5 seconds to allow re-processing
  setTimeout(() => processed.delete(slug), 5000);

  console.log(`\nNew photo detected: ${slug}`);

  // Wait for file to be fully written
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check if file still exists
  if (!fs.existsSync(yamlPath)) {
    console.log(`  File no longer exists, skipping`);
    return;
  }

  const result = await processPhoto(yamlPath, outputDir);

  if (result.success) {
    console.log(`  ✅ ${result.slug} (${result.width}x${result.height})`);
  } else if (result.skipped) {
    console.log(`  ⏭️  ${result.slug} (skipped)`);
  } else {
    console.log(`  ❌ ${result.slug} - ${result.error}`);
  }
}

// Watch directory with native fs.watch
const watcher = fs.watch(contentDir, { persistent: true }, (eventType, filename) => {
  if (filename && eventType === 'rename') {
    handlePhoto(filename);
  }
});

watcher.on('error', (error) => {
  console.error('Watcher error:', error);
});

// Keep process running
process.on('SIGINT', () => {
  console.log('\nStopping photo watcher...');
  watcher.close();
  process.exit(0);
});
