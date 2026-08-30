import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = fs.readFileSync(path.join(__dirname, 'update-categories.mjs'), 'utf-8');

// Find the content between const appContent = ` and the ending `;
const startMarker = 'const appContent = `';
const startIndex = raw.indexOf(startMarker) + startMarker.length;
const endMarker = '`;\n\nfs.writeFileSync(targetPath';
let endIndex = raw.lastIndexOf(endMarker);
if (endIndex === -1) {
  endIndex = raw.lastIndexOf('`;');
}

const content = raw.slice(startIndex, endIndex);
fs.writeFileSync(path.join(__dirname, 'src', 'App.tsx'), content, 'utf-8');
console.log('App.tsx written cleanly!');
