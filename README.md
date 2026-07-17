# PPHLX for PHP (Composer Integration)

[![Latest Stable Version](https://poser.pugx.org/pphlx/pphlx/v/stable)](https://packagist.org/packages/pphlx/pphlx)
[![License](https://poser.pugx.org/pphlx/pphlx/license)](https://packagist.org/packages/pphlx/pphlx)

> Modern Web Component Compiler & PHP Hydration Engine. WebAssembly (WASI) powered.

Official Packagist package for **PPHLX** — enabling you to compile PPHLX (`.pphx`) templates and render hydrated multi-framework layouts natively inside PHP applications (like Laravel, WordPress, or standalone scripts).

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

## License

This project is licensed under the MIT License.
