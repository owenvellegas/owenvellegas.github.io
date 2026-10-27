import { copyFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

copyFileSync('index.source.html', 'index.html');
const child = spawn('npx', ['vite', ...process.argv.slice(2)], { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code || 0));
