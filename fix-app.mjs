import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetPath = path.join(__dirname, 'src', 'App.tsx');

const raw = fs.readFileSync(path.join(__dirname, 'update-app.mjs'), 'utf-8');
// Extract the lines array from update-app.mjs
const startIndex = raw.indexOf('const lines = [');
const endIndex = raw.lastIndexOf('];');
const arrayCode = raw.slice(startIndex, endIndex + 2);

const fn = new Function(arrayCode + '\nreturn lines;');
const lines = fn();

fs.writeFileSync(targetPath, lines.join('\n'), 'utf-8');
console.log('App.tsx written properly with actual newlines!');
