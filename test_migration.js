const fs = require('fs');

const htmlContent = fs.readFileSync('index.html', 'utf8');

if (htmlContent.includes('const oldIncluyeIVA = m.incluyeIVA !== undefined ? m.incluyeIVA : false;')) {
  console.log('Migration logic looks correct.');
} else {
  console.error('Migration logic is missing.');
  process.exit(1);
}

if (htmlContent.includes('incluyeIVABase: false,')) {
    console.log('Initial methods logic looks correct.');
} else {
    console.error('Initial methods logic is missing.');
    process.exit(1);
}

