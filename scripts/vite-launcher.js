
// Launcher per Vite con gestione degli errori
const { spawn } = require('child_process');

function launchVite() {
  const viteCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const viteArgs = ['run', 'vite-dev'];

  console.log("🚀 Avvio Vite...");

  const viteProcess = spawn(viteCommand, viteArgs, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ROLLUP_NATIVE: 'false',
      ROLLUP_NATIVE_BUILD: 'false'
    }
  });

  viteProcess.on('error', (err) => {
    console.error('❌ Errore:', err.message);
    process.exit(1);
  });

  viteProcess.on('close', (code) => {
    process.exit(code || 0);
  });

  // Gestione segnali
  process.on('SIGINT', () => {
    console.log("\n🛑 Terminazione...");
    viteProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log("\n🛑 Terminazione...");
    viteProcess.kill('SIGTERM');
  });

  console.log("✅ Sistema protetto attivo");
}

module.exports = { launchVite };
