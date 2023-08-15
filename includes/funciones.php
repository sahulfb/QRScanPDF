<?php

function debuguear($variable): string
{
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}
function s($html): string
{
    $s = htmlspecialchars($html);
    return $s;
}

function is_auth(): bool
{
    if (!isset($_SESSION)) {
        session_start();
    }
    return isset($_SESSION['nombre']) && !empty($_SESSION);
}

function is_admin(): bool
{
    if (!isset($_SESSION)) {
        session_start();
    }
    return isset($_SESSION['admin']) && !empty($_SESSION['admin']);
}

function ruta_valida(): string
{
    $currentUrl = $_SERVER['REQUEST_URI'];
    if (strpos($currentUrl, '/admin/panel') !== false) {
        $bodyClass = 'admin-panel';
    } else {
        $bodyClass = '';
    }
    return $bodyClass;
}

function eliminarDocumento($nombreDocumento)
{
    $rutaDocumento = $_SERVER['DOCUMENT_ROOT'] . '/documentos/' . $nombreDocumento;

    if (file_exists($rutaDocumento)) {
        if (unlink($rutaDocumento)) {
            return true; // Eliminación exitosa
        } else {
            return false; // Problema al eliminar
        }
    } else {
        return false; // Documento no existe
    }
}

function is_admin_panel()
{
    $basePath = '/admin/panel'; // Ruta base que deseas verificar
    $currentPage = $_SERVER['REQUEST_URI'];

    // Comprobar si la URL comienza con la ruta base y también tiene parámetros de consulta
    return (strpos($currentPage, $basePath) === 0) && isset($_GET['page']);
}
