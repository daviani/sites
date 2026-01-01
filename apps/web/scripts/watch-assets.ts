import fs from 'fs';
import path from 'path';
import { processPhoto, syncCvAssets } from './process-assets';

// Photos directories
const photosContentDir = path.join(process.cwd(), 'content/photos/local');
const photosOutputDir = path.join(process.cwd(), 'public/photos');

// CV directories (watch is always dev mode, so use local path)
const cvContentDir = path.join(process.cwd(), 'content/cv/local/personal');

// Ensure directories exist
if (!fs.existsSync(photosContentDir)) {
  fs.mkdirSync(photosContentDir, { recursive: true });
}
if (!fs.existsSync(photosOutputDir)) {
  fs.mkdirSync(photosOutputDir, { recursive: true });
}
if (!fs.existsSync(cvContentDir)) {
  fs.mkdirSync(cvContentDir, { recursive: true });
}

console.log('Watching for asset changes...');
console.log('  - Photos: content/photos/local/');
console.log('  - CV: content/cv/local/personal/');
console.log('Ready.\n');

// Track processed files to avoid duplicates
const processedPhotos = new Set<string>();
const processedCv = new Set<string>();

// Process a photo
async function handlePhoto(filename: string) {
  if (!filename.endsWith('.yaml')) return;

  const yamlPath = path.join(photosContentDir, filename);
  const slug = path.basename(filename, '.yaml');

  // Skip if already processed recently
  if (processedPhotos.has(slug)) return;
  processedPhotos.add(slug);

  // Remove from processed after 5 seconds to allow re-processing
  setTimeout(() => processedPhotos.delete(slug), 5000);

  console.log(`\n[Photos] New photo detected: ${slug}`);

  // Wait for file to be fully written
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check if file still exists
  if (!fs.existsSync(yamlPath)) {
    console.log(`  File no longer exists, skipping`);
    return;
  }

  const result = await processPhoto(yamlPath, photosOutputDir);

  if (result.success) {
    console.log(`  ✅ ${result.slug} (${result.width}x${result.height})`);
  } else if (result.skipped) {
    console.log(`  ⏭️  ${result.slug} (skipped)`);
  } else {
    console.log(`  ❌ ${result.slug} - ${result.error}`);
  }
}

// Handle CV asset change
function handleCvAsset(filename: string) {
  // Skip if already processed recently
  if (processedCv.has(filename)) return;
  processedCv.add(filename);

  // Remove from processed after 2 seconds to allow re-processing
  setTimeout(() => processedCv.delete(filename), 2000);

  console.log(`\n[CV] Asset changed: ${filename}`);

  // Wait for file to be fully written
  setTimeout(() => {
    const result = syncCvAssets();
    if (result.synced.length > 0) {
      console.log(`  ✅ Synced: ${result.synced.join(', ')}`);
    } else {
      console.log(`  ⏭️  Already up to date`);
    }
  }, 500);
}

// Watch photos directory
const photosWatcher = fs.watch(photosContentDir, { persistent: true }, (eventType, filename) => {
  if (filename && eventType === 'rename') {
    handlePhoto(filename);
  }
});

// Watch CV directory
const cvWatcher = fs.watch(cvContentDir, { persistent: true }, (eventType, filename) => {
  if (filename) {
    handleCvAsset(filename);
  }
});

photosWatcher.on('error', (error) => {
  console.error('Photos watcher error:', error);
});

cvWatcher.on('error', (error) => {
  console.error('CV watcher error:', error);
});

// Keep process running
process.on('SIGINT', () => {
  console.log('\nStopping asset watchers...');
  photosWatcher.close();
  cvWatcher.close();
  process.exit(0);
});