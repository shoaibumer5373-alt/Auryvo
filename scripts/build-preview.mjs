import { execSync } from 'node:child_process';

execSync('tsc --noEmit', { stdio: 'inherit' });
execSync('vite build --base=./ --outDir docs --emptyOutDir', { stdio: 'inherit' });
