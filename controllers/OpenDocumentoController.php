<?php

namespace Controllers;

use Model\Documentos_info;
use MVC\Router;

class OpenDocumentoController
{
    public static function digital()
    {
        if (isset($_GET['data']) && !empty($_GET['data'])) {
            $cadena = filter_var($_GET['data'], FILTER_SANITIZE_STRING);
            if ($cadena !== false) {
                $pattern = '/^([A-Z]+[0-9]+)\./';
                preg_match($pattern, $cadena, $matches);
                $folio = $matches[1];
                $docInfoA = Documentos_info::where('folio', $folio);
                if (empty($docInfoA)) {
                    header('Location: /404');
                    return;
                }
                $rutaPdf = $_SERVER['DOCUMENT_ROOT'] . '/documentos/' . $docInfoA->documento;
                $nombreArchivo = urlencode($docInfoA->documento);
                $fp = fopen($rutaPdf, 'rb');
                // Validar la existencia del archivo PDF
                if (file_exists($rutaPdf)) {
                    header('Content-Type: application/octet-stream');
                    header("Content-Transfer-Encoding: Binary");
                    header('Content-type: application/pdf');
                    header('Content-Disposition: inline; filename="' . $nombreArchivo . '"');
                    // Send the file contents to the browser
                    while (!feof($fp)) {
                        echo fread($fp, 8192);
                        flush();
                    }

                    // Close the file
                    fclose($fp);
                } else {
                    header('Location: /admin/panel');
                }
            } else {
                header('Location: /');
            }
        } else {
            header('Location: /');
        }
    }
}
