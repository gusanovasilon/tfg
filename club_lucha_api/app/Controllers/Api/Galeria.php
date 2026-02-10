<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\GaleriaModel;

class Galeria extends ResourceController
{
    protected $modelName = 'App\Models\GaleriaModel';
    protected $format    = 'json';

    /**
     * GET /api/galeria
     * Devuelve todas las fotos
     */
    public function index()
    {
        // 1. Instanciamos el modelo
        $model = new GaleriaModel();

        // 2. Obtenemos TODAS las fotos
        // (Angular se encargará de filtrar si es ID 1 o ID 2)
        $data = $model->findAll();

        // 3. Devolvemos la respuesta en JSON con cabeceras CORS
        return $this->respondWithCors($data);
    }

    /**
     * Función auxiliar para evitar problemas de CORS (Angular vs PHP)
     */
    private function respondWithCors($data, $statusCode = 200)
    {
        $response = $this->response->setStatusCode($statusCode)
                                   ->setJSON($data);

        // Permitir que Angular (localhost:4200) acceda a los datos
        $response->setHeader('Access-Control-Allow-Origin', '*') // O pon 'http://localhost:4200' para más seguridad
                 ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                 ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        
        return $response;
    }
    
    // Si tu navegador hace una petición OPTIONS (preflight), responde esto:
    public function options()
    {
        return $this->respondWithCors(null, 200);
    }
}