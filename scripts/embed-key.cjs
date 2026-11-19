const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const key = (process.env.OPENAI_API_KEY || (process.env.MSS_API_KEY_FILE ? fs.readFileSync(process.env.MSS_API_KEY_FILE, 'utf8') : '')).trim();
if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(key)) {
  console.error('No hay una clave API válida. Define OPENAI_API_KEY o MSS_API_KEY_FILE sin pegarla en el código ni en comandos.');
  process.exit(1);
}
fs.writeFileSync(path.join(root, 'src/config/embedded-key.ts'), '// Clave dedicada a demo privada; extraíble del APK.\nexport const EMBEDDED_API_KEY = ' + JSON.stringify(key) + ';\n', {mode: 0o600});
fs.chmodSync(path.join(root, 'src/config/embedded-key.ts'), 0o600);
console.log('Clave de pruebas integrada. Su valor no se ha mostrado. Excluir este archivo del ZIP público.');
