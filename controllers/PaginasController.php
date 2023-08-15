<?php

namespace Controllers;

use Model\Usuario;
use MVC\Router;

class PaginasController
{
    public static function index(Router $router)
    {
        $router->render('paginas/index', [
            'titulo' => 'Inicio',
        ]);
    }

    public static function login(Router $router)
    {

        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $usuario = new Usuario($_POST);

            $alertas = $usuario->validarLogin();

            if (empty($alertas)) {
                // Verificar quel el usuario exista
                $usuario = Usuario::where('usuario', $usuario->usuario);
                if (!$usuario || !$usuario->confirmado) {
                    Usuario::setAlerta('error', 'El Usuario No Existe o no esta confirmado');
                } else {
                    // El Usuario existe
                    if (password_verify($_POST['password'], $usuario->password)) {

                        // Iniciar la sesión
                        session_start();
                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre;
                        $_SESSION['apellido'] = $usuario->apellido;
                        $_SESSION['email'] = $usuario->usuario;
                        $_SESSION['admin'] = $usuario->admin ?? null;
                    } else {
                        Usuario::setAlerta('error', 'Password Incorrecto');
                    }
                }
            }
        }

        $alertas = Usuario::getAlertas();

        // Render a la vista 
        $router->render('/', [
            'titulo' => 'Iniciar Sesión',
            'alertas' => $alertas
        ]);
    }

    public static function error(Router $router)
    {

        $router->render('paginas/error', [
            'titulo' => 'No se pudo encontrar el documento'
        ]);
    }
}
