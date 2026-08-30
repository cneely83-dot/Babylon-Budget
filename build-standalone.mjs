import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('Error: Could not find JS or CSS bundle in dist/assets.');
  process.exit(1);
}

const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');

// Escape </script> inside JS to prevent breaking HTML parser
const safeJsContent = jsContent.replace(/<\/script>/gi, '<\\/script>');

const standaloneHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0b3b36" />
    <title>Babylon Budget - Build Enduring Wealth</title>
    <meta name="description" content="Track your spending, budget with confidence, and build enduring wealth inspired by The Richest Man in Babylon." />
    <style>
${cssContent}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
${safeJsContent}
    </script>
  </body>
</html>
`;

const outputPath = path.join(rootDir, 'Babylon Budget.html');
fs.writeFileSync(outputPath, standaloneHtml, 'utf-8');
console.log(`Created standalone web page at: ${outputPath}`);
