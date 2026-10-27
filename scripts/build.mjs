import { copyFileSync, cpSync } from 'node:fs';
import { execSync } from 'node:child_process';

console.log('Restoring source HTML template for build...');
copyFileSync('index.source.html', 'index.html');

console.log('Running Vite build...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('Copying built static files to repo root for GitHub Pages...');
cpSync('dist', '.', { recursive: true });
console.log('Build & static deployment sync complete!');
