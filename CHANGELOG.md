# Changelog

All notable changes to the PPHLX Composer package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Redesigned development server ready states and startup outputs to mimic the clean Astro CLI logs without emojis.

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
