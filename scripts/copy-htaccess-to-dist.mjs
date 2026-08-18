import { copyFile, mkdir, access, constants } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'public', '.htaccess');
const distDir = path.join(root, 'dist');
const dest = path.join(distDir, '.htaccess');

await mkdir(distDir, { recursive: true });
try {
  await access(src, constants.F_OK);
  await copyFile(src, dest);
} catch {
  console.log('[copy-htaccess-to-dist] public/.htaccess not found, skipping');
}
