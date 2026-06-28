const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  /name="viewport"[^>]*>/,
  'name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />'
);
fs.writeFileSync(file, html);
console.log('✅ Viewport fixed');
