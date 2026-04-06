const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

/**
 * Upload all images from a local folder to Supabase Storage bucket `product-images`
 * and optionally generate public URLs.
 *
 * Required env vars:
 *   SUPABASE_URL=https://your-project.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *
 * Optional env vars:
 *   BUCKET_NAME=product-images
 *   IMAGE_DIR=./product-images
 *   TARGET_PREFIX=products
 *   MAKE_PUBLIC=true
 *
 * Usage:
 *   node upload_supabase_product_images.js
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME || 'product-images';
const IMAGE_DIR = process.env.IMAGE_DIR || './product-images';
const TARGET_PREFIX = (process.env.TARGET_PREFIX || 'products').replace(/^\/+|\/+$/g, '');
const MAKE_PUBLIC = (process.env.MAKE_PUBLIC || 'true').toLowerCase() === 'true';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!fs.existsSync(IMAGE_DIR)) {
  console.error(`Image directory not found: ${IMAGE_DIR}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');
}

function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

async function ensureBucketExists() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    throw error;
  }

  const exists = buckets.some((b) => b.name === BUCKET_NAME);
  if (exists) {
    console.log(`Bucket already exists: ${BUCKET_NAME}`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: MAKE_PUBLIC,
    fileSizeLimit: '10MB',
  });

  if (createError) {
    throw createError;
  }

  console.log(`Created bucket: ${BUCKET_NAME}`);
}

async function uploadFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    console.log(`Skipping unsupported file: ${filePath}`);
    return null;
  }

  const originalName = path.basename(filePath);
  const safeName = sanitizeFileName(originalName);
  const storagePath = TARGET_PREFIX ? `${TARGET_PREFIX}/${safeName}` : safeName;
  const fileBuffer = fs.readFileSync(filePath);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: getContentType(ext),
      upsert: true,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Upload failed for ${filePath}: ${error.message}`);
  }

  let publicUrl = null;
  if (MAKE_PUBLIC) {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    publicUrl = data.publicUrl;
  }

  return {
    localFile: filePath,
    fileName: originalName,
    storagePath,
    publicUrl,
  };
}

async function main() {
  try {
    await ensureBucketExists();

    const allFiles = walk(IMAGE_DIR);
    const imageFiles = allFiles.filter((f) => allowedExtensions.has(path.extname(f).toLowerCase()));

    if (imageFiles.length === 0) {
      console.log('No image files found.');
      return;
    }

    console.log(`Found ${imageFiles.length} image(s). Starting upload...`);

    const results = [];
    for (const file of imageFiles) {
      try {
        const result = await uploadFile(file);
        if (result) {
          results.push(result);
          console.log(`Uploaded: ${result.fileName} -> ${result.storagePath}`);
          if (result.publicUrl) {
            console.log(`Public URL: ${result.publicUrl}`);
          }
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    const outputPath = path.resolve(process.cwd(), 'uploaded-images-map.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nDone. Upload map saved to: ${outputPath}`);
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
}

main();
