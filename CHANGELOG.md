# Changelog

All notable changes to the PPHLX Composer package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.8] - 2026-09-05

### Added
- **Directives Compilation Engine (`set:html`, `set:text`, `is:raw`, `is:inline`)**:
  - `set:html`: Reactive unescaped HTML content binding (`<div set:html="$rawHtml"></div>` ➔ `<?php echo $rawHtml; ?>`).
  - `set:text`: Safe text rendering escaping HTML entities via `htmlspecialchars` (`<span set:text="$escapedText"></span>` ➔ `<?php echo htmlspecialchars($escapedText); ?>`).
  - `is:raw`: Retains literal template contents without parsing expressions.
  - `is:inline`: Keeps inline style and script blocks unbundled inside components.
- **Multi-Platform Binary Packaging Sync**: Synced all platform binaries (`pphlx-win.exe`, `pphlx-linux`, `pphlx-macos`, `pphlx.wasm`) inside `pphlx-composer/bin/` with compiler version `v1.1.8`.

---

## [1.1.7] - 2026-07-31

### Fixed
- **Multi-Platform Binary Packaging Sync**: Synchronized all native Go binaries (`pphlx-win.exe`, `pphlx-linux`, `pphlx-macos`, `pphlx.wasm`) inside `pphlx-composer/bin/` with compiler version (`v1.1.7`).
- **MCP ServerInfo Version & Protocol Date**: Updated `pphlx mcp` initialization handler to dynamically report `v1.1.7` and dynamic release date format.

---

## [1.1.6] - 2026-07-30

### Fixed
- **SSG Deep Route Asset Path Traversal Invariant**: Fixed asset injection tag generation for `"target": "ssg"` builds. Injected `<link rel="stylesheet">` and `<script src="...">` tags now use root-absolute (`/assets/css/styles.css`, `/assets/js/bundle.js`) or configured `base` URL prefixed paths (`/subfolder/assets/...`), preventing 404 resource errors on deep subpages (e.g. `/pages/gradient/index.html`).
- **Non-Blocking Public & Static Asset Resolution**: Updated `RunDiagnostics` to inspect `public/`, `src/assets/`, and root project directories. Replaced fatal build halts (`[FATAL BUILD HALT]` / `os.Exit(1)`) with non-blocking diagnostic warnings, providing full developer flexibility for static or dynamically-loaded assets.
- **Root Directory Cleanup & Isolated Temp Config Storage**: Isolated temporary auto-generated Vite bundler configuration files into `.pphlx/pphlx.vite.config.mjs`, ensuring project root directories remain 100% clean.

### Added
- **Single Source of Truth Configuration (`pphlx.config.mjs` / `pphlx.config.cjs`)**: Added ESM and CJS JavaScript configuration support with Astro parity. Developers can define site URL, base path, build target, and Vite island plugins in a single configuration file without needing secondary `.vite.config.mjs` files.
- **Astro Parity Zero-Config Mode & Automatic Fallbacks**: Automatically assigns default settings (`srcDir: "src"`, `outDir: "dist"`, `base: "/"`, `output.target: "php"`) when fields are omitted or when running without a configuration file (`export default defineConfig({})`).
- **Dynamic Framework Plugin Auto-Detection**: Added automatic `package.json` inspection (`detectVitePlugins`) to auto-detect installed framework dependencies (`vue`, `svelte`, `solid-js`, `react`, `preact`) and dynamically import only installed plugins in zero-config mode.

---

## [1.1.5] - 2026-07-28

### Added
- **PPHLX Language Specification Standard (v1.0)**: Created formal language specification defining `.pphx` template structure, token semantics (`{|= $expr |}`, `{| $stmt |}`), island hydration directives (`client:load`, `client:visible`, `client:idle`), and asset injection invariants.
- **Universal Framework Source Extension Guard (`FrameworkSourceExtensions`)**: Defined explicit UI framework source extensions (`.jsx`, `.tsx`, `.vue`, `.svelte`, `.solid.jsx`, `.solid.tsx`, `.ts`, `.mts`, `.cts`, `.marko`, `.astro`) to automatically omit raw uncompiled framework source files from standalone `dist/` copying while preserving all non-code static assets (`.png`, `.svg`, `.css`, `.js`, `.pdf`, `.json`, `.wasm`) with exact tree hierarchy.
- **Recursive Import Dependency Graph Scanner (`buildDependencyGraph`)**: Enhanced Pass 1 graph construction to recursively traverse `@import` component dependency trees down to depth N, ensuring nested layout components (e.g. `Head.pphx` imported by `Layout.pphx`) are properly registered and suppressed from leaking into `dist/components/`.
- **Dev Server Direct Access Protection Pages**: Added dev mode HTTP 404 Developer Safeguard Pages returning clean styled notices when direct browser requests hit absorbed component modules, unattached framework source files, or `.pphlxignore` paths.
- **Zero-Allocation `fmt.Appendf` HTTP Responses**: Optimized dev server HTTP error writing by replacing `[]byte(fmt.Sprintf(...))` string allocations with zero-allocation `fmt.Appendf(nil, ...)` byte slice formatting.

### Fixed
- **Unlimited-Depth Recursive Component Compilation**: Updated `compilePage` to recursively compile imported `.pphx` template trees to any depth (`Page` ➔ `Layout` ➔ `Head` ➔ `Meta`), ensuring child components (e.g. `Head.pphx` extracted from `Layout.pphx`) expand correctly without leaving un-compiled tags.
- **Single & Double Quote `@import` Directive Support**: Updated `importRegex` to parse both single-quoted (`'...'`) and double-quoted (`"..."`) component import paths seamlessly.
- **Component Prop JSON Serialization Invariant**: Updated `renderJSComponent` to extract `{|= $expr |}` tag values and serialize them as `json_encode($expr)` inside island script tags (`window.pphlxProps[...] = {"title": <?php echo json_encode($reactTitle); ?>};`), ensuring valid JSON payload evaluation for React, Vue, Svelte, SolidJS, and Preact islands.
- **Preview / Start Smart Auto-Build Fallback**: Updated `pphlx preview` and `pphlx start` CLI commands to inspect `dist/`. If `dist/` is missing or empty, PPHLX automatically builds the project before starting the preview web server.
- **Synchronous Preview HTTP Web Server**: Refactored `pphlx preview` to run synchronously on the main thread, keeping the HTTP server running continuously until user termination (`Ctrl+C`).
- **Preview `index.php` Entry Point Resolution & Live PHP CLI Stream Evaluation**: Mapped `/` and `/index.php` HTTP requests in `preview` mode to `dist/index.php`, serving pages with `Content-Type: text/html; charset=utf-8` and evaluating backend PHP code blocks via local PHP CLI.
- **Windows Command-Line 32KB Argument Truncation via Stdin Pipe**: Updated dev server PHP evaluation to stream raw HTML through `cmd.Stdin` (`php -r "eval('?>'.file_get_contents('php://stdin'));"`), eliminating Windows 32KB command line argument string limits and preventing syntax errors on large HTML files.
- **`.pphlx/cache` Dev Mode Isolation**: Redirected dev mode Vite island compilation output to `.pphlx/cache/` (matching Astro's `.astro/cache` standard). Ensures production `dist/` is 100% untouched and never created during `npm run dev`.
- **Deterministic FNV-32a Island Container Hashing**: Replaced timestamp-based island IDs with deterministic FNV-32a component/framework hashing, keeping island container IDs consistent across page refreshes.
- **PHP Dev Server Terminal Error Logger**: Captured PHP CLI evaluation errors during `pphlx dev` and logged formatted stack trace alerts directly to the terminal console.
- **Single Source of Truth Compiler Helper (`CompilePageWithAssets`)**: Added `CompilePageWithAssets()` helper in `main.go` to unify template compilation and autonomous asset tag injection (`<script src="assets/js/bundle.js"></script>` and `<link rel="stylesheet" href="assets/css/styles.css">`) across both native CLI builds and browser WebAssembly.
- **Go WebAssembly Asset Tag Parity**: Updated `main_wasm.go` to delegate directly to `CompilePageWithAssets()`, ensuring browser WASM engine output includes `<script src="assets/js/bundle.js"></script>` and matches native CLI compilation 100%.

---

## [1.1.4] - 2026-07-25

### Added
- **Pure 100% In-Memory Go HTTP Dev Server Engine**: Refactored `pphlx dev` to compile pages and evaluate templates 100% in-memory without creating `.pphlx_dev_cache/` or `.pphlx_router.php` files on disk.
- **2-Pass Dependency Graph Compilation & Component Suppression**: Automatically tracks component dependencies via `@import` statements to inline template components into parent routes while suppressing duplicate component emissions in `dist/`.
- **Safe Empty `dist/` Directory Contents Wipe (`wipeDirContents`)**: Safely clears files and subdirectories inside `dist/*` while preserving the root `dist/` directory handle for active dev servers and file explorers.
- **`.pphlxignore` Git-Style Exclusion Manifest**: Support for `.pphlxignore` build exclusion rules with wildcard matching.
- **High-Performance Go-Optimized Dev Server Request Logger**: Real-time HTTP request logging with channel-buffered non-blocking worker (`logChan`), zero-allocation object pooling (`sync.Pool`), sub-millisecond precision (`µs`/`ms`), and category badges (`(page)`, `(virtual)`, `(asset)`, `(missing)`).
- **Flexible `srcDir` Entry Resolution**: Added support for configuring `srcDir` as either a directory (`"src"`, `"src/demo"`) or an explicit template file (`"src/index.pphx"`).
- **In-Memory Static Asset Fallback**: Multi-tier fallback serving static assets from `public/` and `src/` directly in memory without disk copies.
- **Formatted Ready Banner**: Updated CLI dev server startup banner and ANSI color styling.

---

## [1.1.3] - 2026-07-24

### Added
- **Smart Dev Server HTTP Routing**: `pphlx dev` automatically serves `/` and `/index.php` with `Content-Type: text/html; charset=utf-8`, preventing unwanted file downloads on non-PHP host machines.
- **Static Asset Copying**: `pphlx build` and `pphlx dev` automatically copy `public/*` static assets directly into `outDir` (`dist/`).

---

## [1.1.2] - 2026-07-24

### Added
- **Embedded Binary Scaffolder Engine**: Packed starter template (`src/index.pphx`, `src/layouts/Layout.pphx`, `src/assets/pphlx.svg`, `public/favicon.svg`, `public/favicon.ico`) directly inside native binaries (`pphlx-win.exe`, `pphlx-linux`, `pphlx-macos`) and `pphlx.wasm`. Zero network latency and 100% offline project initialization.
- **Dual Favicon & README Scaffolding**: `pphlx init` automatically writes `public/favicon.ico` (base64 binary), `public/favicon.svg`, and project `README.md` with complete directory tree diagrams.

---

## [1.1.1] - 2026-07-24

### Added
- **Sub-Millisecond & Pipeline Build Timing**: Added precision build timing output (`✓ Built in 0.8ms`), Standalone Go binary compilation timing, and total pipeline elapsed duration.

### Fixed
- **Cross-Platform Native CLI Execution**: Added automatic native platform binary resolution (`pphlx-win.exe`, `pphlx-macos-arm64/amd64`, `pphlx-linux-arm64/amd64`) in `bin/pphlx.js` with `chmod 755` permissions auto-applied on Linux and macOS.
- **WASI Fallback Polyfill**: Polyfilled `wasi_snapshot_preview1` via Node.js `wasi` module to eliminate WASM instantiation errors on non-Windows operating systems.
- **Cross-Platform Vite Delegation**: Updated Vite shell execution in Go compiler core to select `cmd /c` on Windows and `sh -c` on Linux/macOS, fixing `exec: "cmd": executable file not found in $PATH` errors.

---

## [1.1.0] - 2026-07-23

### Added
- **Clean Root Layout Scaffolding**: `pphlx init` scaffolds root `layouts/Layout.pphx`, `components/`, and `index.pphx` out of `src/` for monolithic project templates.

### Fixed
- **Dev Server Port Allocation & Health Monitoring**: Port pre-checks across IPv4 (`127.0.0.1`), IPv6 (`[::1]`), and wildcard (`0.0.0.0`) sockets with 150ms PHP process health checks, auto-incrementing on binding collisions (`6321` -> `6322`).
- **Configuration Diagnostic Messaging**: Replaced hardcoded `./test_project/pphlx.config.json` error with clean diagnostic configuration prompts.
- **Watcher Optimization**: Watcher filters out `dist/` and `node_modules/` to eliminate infinite rebuild loops when `"srcDir": "."`.

---

## [1.0.9] - 2026-07-22

### Added
- **Global Version Flags**: Full CLI support for `pphlx --version`, `pphlx -v`, `pphlx version`, and `pphlx -version` across native binaries, NPM (`npx pphlx -v`), and Composer (`vendor/bin/pphlx -v`).
- **Network Interface Host Binding**: Multi-adapter local IP resolution for `pphlx dev --host`, automatically displaying local network URLs.

### Fixed
- **Installer User Space Permissions**: Updated universal installer script (`install.sh`) to target `$HOME/.pphlx/bin` without requiring administrator (`sudo`) privileges.
- **PowerShell Windows Asset Matcher**: Fixed string matching logic in `install.ps1` to prevent false positive matching against Darwin binaries.

---

## [1.0.8] - 2026-07-20

### Added
- **Parallel Multi-Environment Compiling**: Support defining an `"environments"` map inside `pphlx.config.json` to compile multiple targets (e.g. web, desktop, and mobile) concurrently.
- **CLI Profile Flags**: Expose `--env` (or `-e`) to build a specific profile, and `--all` to compile all profiles concurrently using native Go Goroutines.

---

## [1.0.7] - 2026-07-20

### Added
- **Desktop Compilation Target**: Package your web codebases into native Windows, macOS, and Linux desktop apps utilizing a GPU-accelerated system WebView.
- **CGO-Free Windows Builds**: Zero-CGO pure-Go compilation on Windows via the `go-webview2` engine (producing ~9.4MB native binaries).
- **Core Native Drivers**: Bound cross-platform JS and PHP APIs for native OS interactions (`openFileDialog`, `saveFileDialog`, `showNotification`, `window.close`).
- **Custom Go Bridge Extension**: Automatically compiles developer-defined Go files inside `src/desktop/` and binds them to the Javascript namespace.
- **Mobile Target Scaffolding**: Natively generate Gradle Android Studio projects (`android`) and Swift Xcode projects (`ios`) preloaded with compiled static assets.

---

## [1.0.6] - 2026-07-18

### Added
- **Multi-Target Outputs**: Compile PPHLX projects to Standard PHP (`php`), Standalone Go Binary (`standalone`), Static Site Generator (`ssg`), and Blade/Twig views.
- **CLI Target Overrides**: Expose `--target` (`-t`) flag to change build formats on the fly.
- **Cross-Compilation**: Configure `"goos"` and `"goarch"` in `pphlx.config.json` to compile standalone binaries for target servers (like `linux/amd64`) directly from Windows.
- **Brand Default Port `6321`**: Custom dev server port with auto-retry collision scanning.
- **Console Interface**: High-performance terminal colors and formatted startup logs.

---

## [1.0.5-1] - 2026-07-17

### Changed
- Updated README documentation with full CLI instructions and compilation targets.

---

## [1.0.5] - 2026-07-17

### Added
- Added native `pphlx preview` mode: starts a local PHP development server pointing directly to the compiled production `dist` directory.
- Added `pphlx check` subcommand in the Go compiler to run diagnostic syntax and component checks on template files.

---

## [1.0.4-1] - 2026-07-15

### Fixed
- Removed unused experimental WASI module import to eliminate Node.js runtime warning messages.

---

## [1.0.4] - 2026-07-15

### Added
- Integrated automatic local PHP development server (`php -S`) execution directly in the background for `pphlx dev` and `pphlx watch` commands.
- Redesigned development server ready states.

### Fixed
- Fixed mobile responsive layout padding collapsing inside multiframe dashboards.
- Switched Node.js execution layer to standard `wasm_exec.js` Go WASM runner to resolve Windows filesystem directory-reading (`readdirent: not implemented`) bugs and completely remove experimental WASI startup warnings.

---

## [1.0.3] - 2026-07-14

### Fixed
- Fixed component loading path mappings when compiled on Windows environments.

---

## [1.0.2] - 2026-07-14

### Changed
- Improved hot-reloading file watch engine to throttle rapid successive edits.

---

## [1.0.1] - 2026-07-14

### Fixed
- Resolved file locking issues under Windows environments during active rebuild cycles.

---

## [1.0.0] - 2026-07-14

### Added
- Initial public release of the official PPHLX PHP integration package.
- Built-in cross-platform Go WebAssembly (WASI) compiler execution layer via local PHP binary wrapper (`bin/pphlx`).
- Native PHP template extraction and hydration runtime support via the `PPHLX\Engine` class.
- Support for PSR-4 autoloading specifications.
