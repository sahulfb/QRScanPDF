<?php

namespace Controllers;


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

        $router->render('admin/panel/index', [
            'titulo' => 'Panel de Administración'
        ]);
    }
}
