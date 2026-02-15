<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\MensajeContactoModel;


class MensajeContacto extends ResourceController
{


    
    protected $format    = 'json';

    // POST /api/mensajes

    public function index()
    {
        $model = new MensajeContactoModel();
        // Los ordenamos por fecha descendente (lo más nuevo primero)
        $mensajes = $model->orderBy('fecha', 'DESC')->findAll();
        
        return $this->respond($mensajes);
    }

    public function delete($id = null)
    {
        $model = new MensajeContactoModel();
        
        // Comprobamos si existe antes de borrar
        $data = $model->find($id);
        
        if ($data) {
            $model->delete($id);
            return $this->respondDeleted(['status' => 'success', 'message' => 'Mensaje eliminado']);
        } else {
            return $this->failNotFound('No se encontró el mensaje con ID: ' . $id);
        }
    }



    public function create()
    {
        $model = new MensajeContactoModel();

        // 1. Recibimos los datos
        $data = $this->request->getJSON(true);


        $rules = [
            'nombre'  => 'required|min_length[3]',
            'email'   => 'required|valid_email',
            'asunto'  => 'required',
            'mensaje' => 'required|min_length[5]',
        ];

        //DEFINIMOS MENSAJES 
        $messages = [
            'nombre' => [
                'required'   => 'Por favor, escribe tu nombre',
                'min_length' => 'El nombre es demasiado corto.'
            ],
            'email' => [
                'required'    => 'El email es obligatorio para poder responderte.',
                'valid_email' => 'Por favor, introduce un email válido.'
            ],
            'asunto' => [
                'required' => 'Debes seleccionar un motivo para el mensaje.'
            ],
            'mensaje' => [
                'required'   => 'El mensaje no puede estar vacío.',
                'min_length' => 'El mensaje es muy corto, explícate un poco mejor.'
            ]
        ];


        if (!$this->validate($rules, $messages)) {

            return $this->failValidationErrors($this->validator->getErrors());
        }

        // SI PASA LA VALIDACIÓN, GUARDAMOS
        if ($model->insert($data)) {
            return $this->respondCreated(['status' => 'success', 'message' => 'Mensaje guardado']);
        } else {
            return $this->failServerError('Error al guardar en base de datos');
        }
    }

    public function options()
    {
        return $this->response->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
}
