<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Noticias extends ResourceController
{
    protected $modelName = 'App\Models\NoticiaModel';
    protected $format    = 'json';

    public function index()
    {
        // Esto hace: SELECT * FROM noticias
        // Y lo devuelve automáticamente como JSON
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM noticias");
        $resultados = $query->getResultArray();

        return $this->respond($resultados);
    }
}