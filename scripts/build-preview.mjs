import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

execSync('tsc --noEmit', { stdio: 'inherit' });
execSync('vite build --base=./ --outDir docs --emptyOutDir', { stdio: 'inherit' });
writeFileSync('docs/.nojekyll', '');
