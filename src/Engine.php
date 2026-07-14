<?php

namespace PPHLX;

class Engine
{
    /**
     * Render a compiled PHP template with the given state variables.
     *
     * @param string $templatePath The absolute or relative path to the compiled PHP template.
     * @param array $data Context variables to extract and bind within the template scope.
     * @return string Evaluated template HTML output.
     */
    public static function render($templatePath, array $data = [])
    {
        if (!file_exists($templatePath)) {
            throw new \InvalidArgumentException("PPHLX Render Error: Precompiled template file not found at '{$templatePath}'");
        }

        // Extract parameters to local variable scope
        extract($data, EXTR_SKIP);

        ob_start();
        include $templatePath;
        return ob_get_clean();
    }
}
