import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const file = 'node_modules/liveline/dist/index.js';
if (!existsSync(file)) {
  console.log('Liveline not installed; skipping visual patch');
  process.exit(0);
}

let source = readFileSync(file, 'utf8');
if (source.includes('AA_LIVELINE_PATCH')) {
  console.log('Liveline visual patch already applied');
  process.exit(0);
}

const fadeBlock = `
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  const fadeGrad = ctx.createLinearGradient(layout.pad.left, 0, layout.pad.left + FADE_EDGE_WIDTH, 0);
  fadeGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
  fadeGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = fadeGrad;
  ctx.fillRect(0, 0, layout.pad.left + FADE_EDGE_WIDTH, layout.h);
  ctx.restore();`;

const gridBlock = `
    ctx.strokeStyle = palette.gridLine;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();`;

const multiCall = `      opts.scrubAmount,
      reveal,
      opts.now_ms
    );`;

let changes = 0;
if (source.includes(fadeBlock)) {
  source = source.replaceAll(fadeBlock, '');
  changes += 1;
}
if (source.includes(gridBlock)) {
  source = source.replaceAll(gridBlock, '');
  changes += 1;
}
if (source.includes(multiCall)) {
  source = source.replace(multiCall, `      opts.scrubAmount,
      reveal,
      opts.now_ms,
      1,
      true,
      1
    );`);
  changes += 1;
}

if (changes === 0) {
  console.warn('Liveline visual patch found no matching blocks; leaving package untouched');
  process.exit(0);
}

writeFileSync(file, `/* AA_LIVELINE_PATCH */\n${source}`);
console.log(`Liveline visual patch applied (${changes} changes)`);
