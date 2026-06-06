const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiPath = path.join(__dirname, '../src/app/api');
const backupPath = path.join(__dirname, '../src/api_backup');

let apiMoved = false;

try {
  if (fs.existsSync(apiPath)) {
    console.log('Moving API folder to project root for static build...');
    fs.renameSync(apiPath, backupPath);
    apiMoved = true;
  }

  console.log('Building static export...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES: 'true' }
  });

  console.log('Static export build completed successfully!');

} catch (error) {
  console.error('Build failed:', error);
  process.exitCode = 1;
} finally {
  if (apiMoved && fs.existsSync(backupPath)) {
    console.log('Restoring API folder to src/app/api...');
    try {
      fs.renameSync(backupPath, apiPath);
    } catch (e) {
      console.error('Failed to restore API folder:', e);
    }
  }
}

