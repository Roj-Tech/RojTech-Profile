import fs from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'cybersec-portfolio-test-version.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!cssMatch) throw new Error('CSS not found');
fs.mkdirSync(path.join(root, 'app'), { recursive: true });
fs.writeFileSync(path.join(root, 'app', 'globals.css'), cssMatch[1].trim());

const assets = [
  'LOGO44.png',
  'Mustafa.PNG',
  'NewBallen.jpeg',
  'Bilind.PNG',
];
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
for (const file of assets) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(root, 'public', file));
  }
}

console.log('Extracted globals.css and copied public assets.');
