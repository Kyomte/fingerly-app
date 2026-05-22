const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/sloper-icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

const SIZES = [
  { file: 'assets/icon.png', size: 1024 },
  { file: 'assets/adaptive-icon.png', size: 1024 },
  { file: 'assets/splash-icon.png', size: 400 },
  { file: 'assets/favicon.png', size: 64 },
];

async function run() {
  for (const { file, size } of SIZES) {
    const outPath = path.join(__dirname, '..', file);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✓ ${file} (${size}×${size})`);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
