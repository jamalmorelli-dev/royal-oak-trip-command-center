#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const svgPath = path.join(root, 'public', 'icon.svg');
const svg = fs.readFileSync(svgPath);

function loadSharp() {
  const candidates = [
    path.join(root, 'node_modules', 'sharp'),
    path.join(root, 'node_modules', 'next', 'node_modules', 'sharp'),
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch {
      /* try next */
    }
  }
  return require('sharp');
}

async function main() {
  const sharp = loadSharp();
  const jobs = [
    ['icon-192.png', 192],
    ['icon-512.png', 512],
    ['apple-touch-icon.png', 180],
  ];
  for (const [name, size] of jobs) {
    const dest = path.join(root, 'public', name);
    await sharp(svg).resize(size, size).png().toFile(dest);
    console.log('wrote', dest, size);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
