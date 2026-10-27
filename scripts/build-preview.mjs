import { execSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';

const env = { ...process.env, VITE_SINGLE_FILE: 'true' };
execSync('tsc --noEmit', { stdio: 'inherit', env });
execSync('vite build --base=./ --outDir docs --emptyOutDir', { stdio: 'inherit', env });
copyFileSync('docs/index.html', 'auryvo-preview.html');
copyFileSync('docs/index.html', 'docs/preview.html');
