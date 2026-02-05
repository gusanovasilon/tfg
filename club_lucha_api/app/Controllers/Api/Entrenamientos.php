<?php namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\EntrenamientoModel;

class Entrenamientos extends ResourceController
{
    
    protected $format    = 'json';

    
    public function index()
    {

        $model = new EntrenamientoModel();

        // getVar es como getGet pero para datos recibidos desde el front nos permite recibir variables por url y recogerlas
        $soloFuturas = $this->request->getVar('proximas') === 'true';
        
        $data = $model->getClases(null, $soloFuturas);
        
        return $this->respond($data);
    }

    
    public function detalle($id = null)
    {
      
        $model = new EntrenamientoModel();
        $data = $model->getClases($id);
        
        if (!$data) {
            return $this->failNotFound('Clase no encontrada');
        }
        return $this->respond($data);
    }
}