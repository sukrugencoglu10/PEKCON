import sharp from 'sharp';
import { readFileSync } from 'fs';

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'favicon-192x192.png' },
  { size: 512, name: 'favicon-512x512.png' },
];

const svgBuffer = readFileSync('public/favicon.svg');

async function generateFavicons() {
  for (const { size, name } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`public/${name}`);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  console.log('\n✅ All favicon files generated successfully!');
}

generateFavicons().catch(console.error);
