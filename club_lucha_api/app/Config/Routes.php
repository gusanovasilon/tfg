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



// 1. BANDEJA DE ENTRADA (Listar chats)
// Recibe el ID del usuario que consulta (ej: api/mensajes/5)
// El controlador comprueba si ese usuario es Admin o Normal y devuelve lo que toca.
$routes->get('api/mensajes/(:num)', [Mensajes::class, 'index']);

// Fíjate en el /$1 al final. Eso significa "Pasa el primer parámetro a la función"
$routes->post('api/mensajes/(:num)', [Mensajes::class, 'create/$1']); 

// Ruta para cuando no hay ID (Nuevo chat)
$routes->post('api/mensajes', [Mensajes::class, 'create']);
// 3. VER CONVERSACIÓN (Detalle)
// Recibe el ID de la CONVERSACIÓN (carpeta), no del usuario.
// Ej: api/mensajes/chat/45 -> Devuelve los mensajes de la carpeta 45.
$routes->get('api/mensajes/chat/(:num)', [Mensajes::class, 'verConversacion']);

// 4. BORRAR CONVERSACIÓN
// Recibe el ID de la CONVERSACIÓN.
// Ej: DELETE api/mensajes/chat/45 -> Borra la carpeta y sus mensajes.
$routes->delete('api/mensajes/chat/(:num)', [Mensajes::class, 'borrarConversacion']);
$routes->delete('api/mensajes/sala/(:num)', [Mensajes::class, 'eliminarSala']);

$routes->post('api/mensajes/aviso-global', [Mensajes::class, 'avisoGlobal']);


// =================================================================
// RUTAS DE ENTRENAMIENTOS E INSCRIPCIONES
// =================================================================

// 1. LISTAR ENTRENAMIENTOS (Tablón)
// Puede recibir ?usuario_id=X por GET para saber si está apuntado
// =================================================================
// RUTAS DE ENTRENAMIENTOS E INSCRIPCIONES
// =================================================================

// =================================================================
// RUTAS DE ENTRENAMIENTOS E INSCRIPCIONES
// =================================================================

// 1. Tablón general
$routes->get('api/entrenamientos', [Entrenamientos::class, 'index']);

// 1.B Tablón personalizado para el Atleta (URL: api/entrenamientos/12)
// Al usar la sintaxis de array, CodeIgniter le pasa el (:num) automáticamente a tablonAtleta
$routes->get('api/entrenamientos/(:num)', [Entrenamientos::class, 'tablonAtleta']);

// 2. CREAR ENTRENAMIENTO (Entrenador)
$routes->post('api/entrenamientos', [Entrenamientos::class, 'create']);

// 3. BORRAR ENTRENAMIENTO (Entrenador)
$routes->delete('api/entrenamientos/(:num)', [Entrenamientos::class, 'delete']);

// 4. APUNTARSE / DESAPUNTARSE (Atleta)
$routes->post('api/entrenamientos/toggle-inscripcion', [Entrenamientos::class, 'toggleInscripcion']);

// 5. VER LISTA DE APUNTADOS (Entrenador)
$routes->get('api/entrenamientos/asistentes/(:num)', [Entrenamientos::class, 'asistentes']);

// 6. PASAR LISTA (Entrenador)
$routes->put('api/entrenamientos/pasar-lista/(:num)', [Entrenamientos::class, 'pasarLista']);

$routes->put('api/entrenamientos/update/(:num)', [Entrenamientos::class, 'update']);