<?php

require_once __DIR__ . '/../includes/app.php';

use MVC\Router;
use Controllers\AuthController;
use Controllers\DashboardController;
use Controllers\GuardarDatosController;
use Controllers\LoginController;
use Controllers\OpenDocumentoController;
use Controllers\PaginasController;

$router = new Router();


// Iniciar Sesión
$router->get('/', [LoginController::class, 'login']);
$router->post('/', [LoginController::class, 'login']);
$router->post('/logout', [LoginController::class, 'logout']);

// Crear Cuenta
$router->get('/registro', [AuthController::class, 'registro']);
$router->post('/registro', [AuthController::class, 'registro']);

// Formulario de olvide mi password
$router->get('/olvide', [AuthController::class, 'olvide']);
$router->post('/olvide', [AuthController::class, 'olvide']);

// Colocar el nuevo password
$router->get('/reestablecer', [AuthController::class, 'reestablecer']);
$router->post('/reestablecer', [AuthController::class, 'reestablecer']);

// Confirmación de Cuenta
$router->get('/mensaje', [AuthController::class, 'mensaje']);
$router->get('/confirmar-cuenta', [AuthController::class, 'confirmar']);

// Area de administración
$router->get('/admin/dashboard', [DashboardController::class, 'index']);
$router->get('/admin/panel', [DashboardController::class, 'panel']);
$router->post('/admin/panel/eliminar', [DashboardController::class, 'eliminar']);
$router->post('/admin/panel/documento', [DashboardController::class, 'documento']);

// API para Guardar Datos
$router->post('/api/guardar', [GuardarDatosController::class, 'guardar']);
$router->post('/api/buscar', [GuardarDatosController::class, 'buscar']);

$router->get('/digital', [OpenDocumentoController::class, 'digital']);
$router->get('/404', [PaginasController::class, 'error']);


$router->comprobarRutas();
