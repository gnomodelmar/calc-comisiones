const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let inHandleCopy = false;
let copyBlock = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const handleCopyOptions = () => {')) {
    inHandleCopy = true;
  }

  if (inHandleCopy) {
    copyBlock.push(lines[i]);
    if (lines[i].includes('navigator.clipboard.writeText')) {
        break;
    }
  }
}

console.log(copyBlock.join('\n'));
