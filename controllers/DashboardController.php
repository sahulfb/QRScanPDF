<?php

namespace Controllers;

use Classes\Paginacion;
use Model\Documentos_info;
use MVC\Router;

class DashboardController
{

    public static function index(Router $router)
    {
        if (!is_admin()) {
            header('Location: /');
        }

        $router->render('admin/dashboard/index', [
            'titulo' => 'Panel de Administración'
        ]);
    }

    public static function panel(Router $router)
    {
        if (!is_admin()) {
            header('Location: /');
        }

        $pagina_actual = $_GET['page'];
        $pagina_actual = filter_var($pagina_actual, FILTER_VALIDATE_INT);
        $total = Documentos_info::total();
        if (!$pagina_actual || $pagina_actual < 1) {
            header('Location: /admin/panel?page=1');
        }
        $registros_por_pagina = 10;
        $totalEmpresa = Documentos_info::totalEmpresas();
        $paginacion = new Paginacion($pagina_actual, $registros_por_pagina, $total);

        if ($paginacion->total_paginas() < $pagina_actual) {
            if ($paginacion->total_paginas() < 1) {
                header('Location: /');
            } else {
                header('Location: /admin/panel?page=' . $paginacion->total_paginas());
            }
        }
        $docInfoAll = Documentos_info::paginar($registros_por_pagina, $paginacion->offset());

        $router->render('admin/panel/index', [
            'titulo' => 'Panel de Administración',
            'docInfoAll' => $docInfoAll,
            'paginacion' => $paginacion->paginacion(),
            'total' => $total,
            'totalEmpresa' => $totalEmpresa
        ]);
    }

    public static function documento()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!is_admin()) {
                header('Location: /');
            }

            $nombrePdf = filter_var($_POST['documento'], FILTER_SANITIZE_STRING);
            $rutaPdf = $_SERVER['DOCUMENT_ROOT'] . '/documentos/' . $nombrePdf;
            // Validar la existencia del archivo PDF
            if (file_exists($rutaPdf)) {
                // Establecer las cabeceras para mostrar el PDF en línea
                header("Content-type: application/pdf");
                header("Content-Disposition: inline; filename=documento.pdf");

                // Leer y mostrar el contenido del archivo PDF
                readfile($rutaPdf);
                exit;
            } else {
                header('Location: /');
            }
        }
    }

    public static function eliminar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!is_admin()) {
                header('Location: /login');
            }

            $id = $_POST['id'];
            $docInfo = Documentos_info::find($id);
            if (empty($id) || !isset($docInfo)) {
                echo json_encode(['resultado' => false]);
                return;
            }

            $resultado = $docInfo->eliminar();
            if ($resultado) {
                echo json_encode(['resultado' => true]);
            }
            $eliminarDoc = eliminarDocumento($docInfo->documento);
            if (!$eliminarDoc) {
                echo json_encode(['resultado' => false]);
                return;
            }
            return;
        }
    }
}
