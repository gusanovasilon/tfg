<?php namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NoticiasModel;

class Noticias extends ResourceController
{
    public function index()
    {
        $model = new NoticiasModel();

        $data = $model->getNoticias();

        if (empty($data)) {
            return $this->failNotFound('No se encontraron noticias');
        }

        return $this->respond($data);
    }

    public function detalle($id)
    {
        $model = new NoticiasModel();

        $data = $model->getNoticias($id);

        if ($id !== null && empty($data)) {
            return $this->failNotFound('No se encontró la noticia con ID: ' . $id);
        }

        return $this->respond($data);
    }

    
    
    
}