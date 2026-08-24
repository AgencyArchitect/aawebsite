import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const files = [
  'node_modules/liveline/dist/index.js',
  'node_modules/liveline/dist/index.cjs',
];

function patch(source, file) {
  let next = source;

  // Liveline's multi-series drawLine call defaults skipDashLine to false.
  // Pass the arguments in the correct order: colorBlend, skipDashLine,
  // fillScale. This removes the horizontal moving dashed line.
  const multiCall = /opts\.scrubAmount,\n\s+reveal,\n\s+opts\.now_ms\n\s+\);/g;
  next = next.replace(
    multiCall,
    'opts.scrubAmount,\n      reveal,\n      opts.now_ms,\n      1,\n      true,\n      1\n    );',
  );

  // Do not erase the left side of the canvas after drawing. This is a
  // destination-out operation, so CSS cannot undo it.
  next = next.replace(
    /\n\s*ctx\.save\(\);\n\s*ctx\.globalCompositeOperation = "destination-out";\n\s*const fadeGrad = ctx\.createLinearGradient\(layout\.pad\.left, 0, layout\.pad\.left \+ FADE_EDGE_WIDTH, 0\);\n\s*fadeGrad\.addColorStop\(0, "rgba\(0, 0, 0, 1\)"\);\n\s*fadeGrad\.addColorStop\(1, "rgba\(0, 0, 0, 0\)"\);\n\s*ctx\.fillStyle = fadeGrad;\n\s*ctx\.fillRect\(0, 0, layout\.pad\.left \+ FADE_EDGE_WIDTH, layout\.h\);\n\s*ctx\.restore\(\);/g,
    '',
  );

  // Keep y-axis labels but remove the horizontal dashed grid strokes.
  next = next.replace(
    /\n\s*ctx\.strokeStyle = palette\.gridLine;\n\s*ctx\.beginPath\(\);\n\s*ctx\.moveTo\(pad\.left, y\);\n\s*ctx\.lineTo\(w - pad\.right, y\);\n\s*ctx\.stroke\(\);/g,
    '',
  );

  if (next === source) {
    console.warn(`Liveline patch made no changes in ${file}`);
  }
  return next;
}

for (const file of files) {
  if (!existsSync(file)) continue;
  const source = readFileSync(file, 'utf8');
  writeFileSync(file, patch(source, file));
}

console.log('Liveline visual patch applied');
