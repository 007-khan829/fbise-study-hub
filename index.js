/**
 * FBISE Study Hub — One-Click Node.js Launcher
 * Developed by Team Khan Hanan
 */

const { spawn } = require('child_process');
const http = require('http');

console.log('======================================================');
console.log('       🎓 FBISE Study Hub — Launcher Entry Point      ');
console.log('   Tagline: Prepare Smart. Practice Better. Achieve More.');
console.log('       Developed by Team Khan Hanan                   ');
console.log('======================================================\n');

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

function checkServer(callback) {
  const req = http.get(URL, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(1500, () => {
    req.destroy();
    callback(false);
  });
}

function openBrowser(targetUrl) {
  console.log(`🌐 Opening in browser: ${targetUrl}`);
  const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawn(startCmd, [targetUrl], { shell: true, detached: true, stdio: 'ignore' });
}

checkServer((isRunning) => {
  if (isRunning) {
    console.log(`✅ FBISE Study Hub is ALREADY RUNNING at ${URL}`);
    openBrowser(URL);
    process.exit(0);
  } else {
    console.log(`⏳ Starting FBISE Study Hub Next.js Server on port ${PORT}...`);
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const server = spawn(npmCmd, ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
    });

    let opened = false;
    const interval = setInterval(() => {
      checkServer((ready) => {
        if (ready && !opened) {
          opened = true;
          clearInterval(interval);
          console.log(`\n🎉 Server is LIVE! Launching browser at ${URL}...`);
          openBrowser(URL);
        }
      });
    }, 1000);

    process.on('SIGINT', () => {
      clearInterval(interval);
      server.kill('SIGINT');
      process.exit(0);
    });
  }
});
