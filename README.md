# PPHLX for PHP (Composer Integration)

<br/>
<p align="center">
  <img src=".github/assets/banner.webp" alt="Bring Your Own UI Framework">
  <br/><br/>
  <a href="https://pphlx.org">PPHLX</a> is the high-performance monolithic compiler for modern PHP web applications.
  <br/>
  Build component-driven PHP apps with React, Vue, Svelte, or pure PHP templates — with zero Node.js runtime in production.
  <br/><br/>
</p>

<p align="center">
  <a href="https://packagist.org/packages/pphlx/pphlx"><img src="https://poser.pugx.org/pphlx/pphlx/v/stable" alt="Latest Stable Version"></a>
  <a href="https://packagist.org/packages/pphlx/pphlx"><img src="https://poser.pugx.org/pphlx/pphlx/license" alt="License"></a>
</p>

Official Packagist package for **PPHLX**. Enables you to compile `.pphx` templates and render hydrated multi-framework component layouts natively inside any PHP application (Laravel, WordPress, or custom scripts).

---

## Installation

Install PPHLX inside your PHP project using Composer:

```bash
composer require pphlx/pphlx
```

*Note: PPHLX runs as a WebAssembly compiler under the hood. A local execution runtime (such as Node.js or Wasmer) is required on your development machine to compile templates.*

---

## Compilation CLI

This package registers a vendor binary executable. You can run the compiler from the root of your PHP project:

```bash
# Initialize project configurations
vendor/bin/pphlx init

# Start local hot-reload compiler server
vendor/bin/pphlx dev

# Run diagnostic template validation
vendor/bin/pphlx check

# Compile templates to production-ready PHP files
vendor/bin/pphlx

# Preview the compiled production site locally
vendor/bin/pphlx preview
```

---

## Runtime Usage

Once templates are compiled to standard `.php` files inside your output directory, you can load and render them using the built-in runtime engine:

```php
use PPHLX\Engine;

// Render template with context state variables
$html = Engine::render(__DIR__ . '/dist/index.php', [
    'reactTitle' => 'Interactive Rating Widget',
    'vueDefaultTemp' => 22
]);

echo $html;
```

---

## Multi-Target Compilation

PPHLX supports compiling your application to multiple target formats. By default, it compiles to standard `.php` files. You can configure this inside `pphlx.config.json` or override it on the fly using CLI flags.

### Configuration (`pphlx.config.json`)

To configure a default target, add the `"output"` block:

```json
{
  "srcDir": "src",
  "outDir": "dist",
  "output": {
    "target": "desktop",
    "goos": "darwin",
    "goarch": "arm64"
  }
}
```

*   `target`: `"php"` (default), `"standalone"` (headless Go server binary), `"desktop"` (native desktop GUI app), `"android"` (scaffolded Android Studio Gradle project), `"ios"` (scaffolded Swift Xcode project), `"ssg"` (static HTML/JS/CSS), or `"blade"`/`"twig"` (framework-native template views).
*   `goos` / `goarch`: (Optional) Target cross-compilation OS (e.g. `linux`, `darwin`, `windows`) and architecture (e.g. `amd64`, `arm64`) when compiling standalone or desktop binaries.

### CLI Overrides

Pass the `--target` (or `-t`) flag to temporarily customize the output target during a build:

```bash
# Compile to a Standalone Go Binary
vendor/bin/pphlx build --target standalone

# Compile to a Native Desktop App
vendor/bin/pphlx build --target desktop

# Compile to an Android Gradle project
vendor/bin/pphlx build --target android

# Compile to an iOS Xcode project
vendor/bin/pphlx build --target ios

# Compile to Static HTML (SSG)
vendor/bin/pphlx build --target ssg

# Compile to Laravel Blade templates
vendor/bin/pphlx build --target blade

# Compile to Symfony Twig templates
vendor/bin/pphlx build --target twig
```

---

## License

This project is licensed under the MIT License.
