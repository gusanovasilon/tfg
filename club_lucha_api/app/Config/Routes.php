<?php

use CodeIgniter\Router\RouteCollection;
use App\Controllers\Api\Auth;
use App\Controllers\Api\Noticias;
use App\Controllers\Api\Entrenamientos;
use App\Controllers\Api\FichaDeportiva;
use App\Controllers\Api\Galeria;
use App\Controllers\Api\MensajeContacto;
use App\Controllers\Api\Mensajes;
use App\Controllers\Api\Usuarios;

/**
 * @var RouteCollection $routes
 */


/* <--  BLOQUE CORS ES NECESARIO DEBIDO A: --> */
/* Este bloque de codigo es necesario debido a que previamente a la peticion POST llega una peticion OPTIONS

Si no hay una ruta definida para el options se lanza un error 404 y corta el proceso antes de aplicar las cabeceras correctamente

Esto es necesario debido al preflight de tipo OPTIONS antes del POST */
$routes->options('(:any)', function() {
    $response = \Config\Services::response();
    $response->setHeader('Access-Control-Allow-Origin', '*');
    $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With');
    return $response->setStatusCode(200);
});


$routes->post('api/login', [Auth::class, 'login']);
$routes->get('api/noticias', [Noticias::class, 'index']);
$routes->get('api/noticias/(:num)', [Noticias::class, 'show']);
$routes->post('api/noticias/', [Noticias::class, 'create']);
$routes->delete('api/noticias/(:num)', [Noticias::class, 'delete']);
$routes->post('api/noticias/(:num)', [Noticias::class, 'update']);
$routes->get('api/entrenamientos', [Entrenamientos::class, 'index']);
$routes->get('api/entrenamientos/(:num)', [Entrenamientos::class, 'detalle']);
$routes->get('api/galeria', [Galeria::class, 'index']);

// Rutas para gestión de mensajes
$routes->get('api/mensajes', [MensajeContacto::class, 'index']);
$routes->post('api/contacto', [MensajeContacto::class, 'create']);
$routes->delete('api/mensajes/(:num)', [MensajeContacto::class, 'delete']);
$routes->options('api/mensajes/(:any)',  [MensajeContacto::class, 'options']);

$routes->get('api/usuarios', [Usuarios::class, 'index']);
$routes->post('api/usuarios', [Usuarios::class, 'create']);
$routes->put('api/usuarios/(:num)', [Usuarios::class, 'update']);
$routes->delete('api/usuarios/(:num)', [Usuarios::class, 'delete']);
$routes->options('api/usuarios/(:any)',  [Usuarios::class, 'options']);


$routes->get('api/fichadeportiva/(:num)', [FichaDeportiva::class, 'show']);
$routes->post('api/fichadeportiva/(:num)',  [FichaDeportiva::class, 'update']);


//Mensajes 

$routes->get('api/mensajes', [Mensajes::class, 'index']); // Para el Admin
$routes->get('api/mensajes/(:num)', [Mensajes::class, 'index']); // Para el Usuario

// 2. ENVIAR NUEVO
$routes->post('api/mensajes', [Mensajes::class, 'create']);

// 3. MARCAR COMO LEÍDO (Añadido el segmento /leer para coincidir con Angular)
$routes->put('api/mensajes/leer/(:num)', [Mensajes::class, 'marcarLeido']);

// 4. BORRAR UN MENSAJE SUELTO
$routes->delete('api/mensajes/(:num)', [Mensajes::class, 'delete']);

// 5. VER CONVERSACIÓN (ADMIN) - ¡Cambio a GET!
$routes->get('api/mensajes/conversacion', [Mensajes::class, 'verConversacion']);

// 6. BORRAR CONVERSACIÓN ENTERA (ADMIN)
$routes->delete('api/mensajes/conversacion', [Mensajes::class, 'borrarConversacion']);