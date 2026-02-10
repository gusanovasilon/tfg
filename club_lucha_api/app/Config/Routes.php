<?php

use CodeIgniter\Router\RouteCollection;
use App\Controllers\Api\Auth;
use App\Controllers\Api\Noticias;
use App\Controllers\Api\Entrenamientos; 
use App\Controllers\Api\Galeria;
use App\Controllers\Api\MensajeContacto;

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
$routes->get('api/noticias/(:num)', [Noticias::class, 'detalle']);
$routes->get('api/entrenamientos', [Entrenamientos::class, 'index']);
$routes->get('api/entrenamientos/(:num)', [Entrenamientos::class, 'detalle']);
$routes->get('api/galeria', [Galeria::class, 'index']);
$routes->post('api/contacto', [MensajeContacto::class, 'create']);