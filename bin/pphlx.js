#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

// Determine output directory from config
let outDir = 'dist';
try {
  const configJsonPath = path.join(process.cwd(), 'pphlx.config.json');
  const manifestJsonPath = path.join(process.cwd(), 'pphlx.json');
  if (fs.existsSync(configJsonPath)) {
    const config = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
    if (config.outDir) outDir = config.outDir;
  } else if (fs.existsSync(manifestJsonPath)) {
    const config = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));
    if (config.outDir) outDir = config.outDir;
  } else {
    const configMjsPath = path.join(process.cwd(), 'pphlx.config.mjs');
    if (fs.existsSync(configMjsPath)) {
      const content = fs.readFileSync(configMjsPath, 'utf8');
      const match = content.match(/outDir\s*:\s*["']([^"']+)["']/);
      if (match) outDir = match[1];
    }
  }
} catch (e) {}

const args = process.argv.slice(2);
const isDev = args.includes('dev') || args.includes('watch');
const isPreview = args.includes('preview');

const timePrefix = () => {
  const d = new Date();
  return `\x1b[90m${d.toTimeString().split(' ')[0]}\x1b[0m`;
};

function getFreePort(startPort, callback) {
  const server = net.createServer();
  server.listen(startPort, 'localhost', () => {
    server.close(() => {
      callback(null, startPort);
    });
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`${timePrefix()} \x1b[33m[pphlx] Port ${startPort} is in use, trying another one...\x1b[0m`);
      getFreePort(startPort + 1, callback);
    } else {
      callback(err);
    }
  });
}

function getNativeBinary() {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === 'win32') {
    const winPath = path.join(__dirname, 'pphlx-win.exe');
    if (fs.existsSync(winPath)) return winPath;
  }

  if (platform === 'darwin') {
    const armPath = path.join(__dirname, 'pphlx-macos-arm64');
    const amdPath = path.join(__dirname, 'pphlx-macos-amd64');
    const defaultPath = path.join(__dirname, 'pphlx-macos');

    if (arch === 'arm64' && fs.existsSync(armPath)) return armPath;
    if (arch === 'x64' && fs.existsSync(amdPath)) return amdPath;
    if (fs.existsSync(defaultPath)) return defaultPath;
  }

  if (platform === 'linux') {
    const armPath = path.join(__dirname, 'pphlx-linux-arm64');
    const amdPath = path.join(__dirname, 'pphlx-linux-amd64');
    const defaultPath = path.join(__dirname, 'pphlx-linux');

    if (arch === 'arm64' && fs.existsSync(armPath)) return armPath;
    if (arch === 'x64' && fs.existsSync(amdPath)) return amdPath;
    if (fs.existsSync(defaultPath)) return defaultPath;
  }

  return null;
}

function runCompiler() {
  const nativeBinary = getNativeBinary();

  if (nativeBinary && fs.existsSync(nativeBinary)) {
    try {
      if (process.platform !== 'win32') {
        try {
          fs.chmodSync(nativeBinary, 0o755);
        } catch (e) {}
      }

      const proc = spawn(nativeBinary, args, { stdio: 'inherit' });
      proc.on('close', (code) => {
        process.exit(code || 0);
      });
      proc.on('error', (err) => {
        console.warn(`[pphlx] Native execution error (${err.message}), attempting WASM fallback...`);
        runWasm();
      });
      return;
    } catch (err) {
      console.warn(`[pphlx] Failed to spawn native binary: ${err.message}, attempting WASM fallback...`);
    }
  }

  runWasm();
}

function runWasm() {
  require('./wasm_exec.js');

  const go = new Go();
  go.argv = process.argv;
  go.env = process.env;

  let importObject = go.importObject;

  try {
    const { WASI } = require('wasi');
    const wasi = new WASI({ version: 'preview1' });
    importObject = {
      ...go.importObject,
      wasi_snapshot_preview1: wasi.wasiImport || (wasi.getImportObject && wasi.getImportObject().wasi_snapshot_preview1)
    };
  } catch (e) {}

  const wasmPath = path.join(__dirname, '../lib/pphlx.wasm');
  if (!fs.existsSync(wasmPath)) {
    console.error(`[pphlx] Error: Compiler binary or WASM file not found at ${wasmPath}`);
    process.exit(1);
  }

  const wasmBuffer = fs.readFileSync(wasmPath);

  WebAssembly.instantiate(wasmBuffer, importObject).then((result) => {
    go.run(result.instance);
  }).catch((err) => {
    console.error('Failed to run PPHLX compiler:', err);
    process.exit(1);
  });
}

if (isPreview || isDev) {
  getFreePort(6321, (err, port) => {
    if (err) {
      console.error('Failed to find open port:', err);
      process.exit(1);
    }

    let version = '1.1.0';
    try {
      const pkg = require('../composer.json');
      version = pkg.version || version;
    } catch (e) {}

    if (isPreview) {
      console.log(`\n  \x1b[30m\x1b[42m pphlx \x1b[0m \x1b[32mv${version} preview mode ready\x1b[0m\n`);
      console.log(`  \x1b[90m┃\x1b[0m \x1b[1mLocal\x1b[0m    \x1b[36mhttp://localhost:${port}/\x1b[0m`);
      console.log(`  \x1b[90m┃\x1b[0m \x1b[90mServing directory: ${outDir}\x1b[0m\n`);
      
      const phpServer = spawn('php', ['-S', `localhost:${port}`, '-t', outDir], {
        stdio: 'inherit'
      });
      phpServer.on('close', (code) => {
        process.exit(code);
      });
    } else if (isDev) {
      const phpServer = spawn('php', ['-S', `localhost:${port}`, '-t', outDir], {
        stdio: 'ignore',
        detached: true
      });
      phpServer.unref();

      console.log(`\n  \x1b[30m\x1b[42m pphlx \x1b[0m \x1b[32mv${version} ready\x1b[0m\n`);
      console.log(`  \x1b[90m┃\x1b[0m \x1b[1mLocal\x1b[0m    \x1b[36mhttp://localhost:${port}/\x1b[0m`);
      console.log(`  \x1b[90m┃\x1b[0m \x1b[90mNetwork  use --host to expose\x1b[0m\n`);

      runCompiler();
    }
  });
} else {
  runCompiler();
}
