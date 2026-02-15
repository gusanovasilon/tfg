<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\MensajeModel;

class Mensajes extends ResourceController
{
    use ResponseTrait;

    // GET: api/mensajes?userId=5 (Para usuarios normales)
    // GET: api/mensajes?admin=true (Para el administrador)
 public function index($userId = null) 
{
    $model = new MensajeModel();
    $isAdmin = $this->request->getGet('admin');

    if ($isAdmin === 'true') {
        return $this->respond($model->getListaConversacionesAdmin());
    }

    if ($userId) {
        return $this->respond($model->getMisMensajes($userId));
    }
    
    return $this->fail('Falta el ID del usuario');
}


    // POST: api/mensajes
    public function create()
    {
        $model = new MensajeModel();
        $data = $this->request->getJSON(true);

        // Validaciones básicas
        if (empty($data['remitente_id']) || empty($data['cuerpo'])) {
            return $this->failValidationErrors('Faltan datos');
        }

        // --- CAMBIO AQUÍ ---
        // Si viene destinatario_id = 0, lo convertimos a NULL y tipo 'anuncio'
        if (isset($data['destinatario_id']) && $data['destinatario_id'] == 0) {
            $data['tipo'] = 'anuncio';
            $data['destinatario_id'] = null; // <--- PONER NULL, NO 0
        } else {
            $data['tipo'] = 'privado';
            if (empty($data['destinatario_id'])) {
                return $this->failValidationErrors('Falta el destinatario');
            }
        }
        // -------------------

        $data['leido'] = 0;

        try {
            if ($model->insert($data)) {
                return $this->respondCreated(['status' => 'success', 'message' => 'Enviado']);
            } else {
                return $this->failServerError('Error al guardar');
            }
        } catch (\Exception $e) {
            // Esto te ayudará a ver errores futuros en el response
            return $this->failServerError($e->getMessage());
        }
    }
    // DELETE: api/mensajes/conversacion?u1=5&u2=8
    // El Admin borra el chat entre el usuario 5 y el 8
    public function borrarConversacion()
    {
        $u1 = $this->request->getVar('u1');
        $u2 = $this->request->getVar('u2');

        if (!$u1 || !$u2) return $this->fail('Faltan los IDs de los usuarios');

        $model = new MensajeModel();

        // Llamamos a la función potente del modelo
        if ($model->borrarConversacionEntera($u1, $u2)) {
            return $this->respondDeleted(['status' => 'success', 'message' => 'Conversación eliminada']);
        }

        return $this->fail('No se pudo borrar');
    }

    // GET: api/mensajes/conversacion?u1=5&u2=8
    // Devuelve todos los mensajes entre el usuario 5 y el 8
    public function verConversacion()
    {
        $u1 = $this->request->getVar('u1');
        $u2 = $this->request->getVar('u2');

        if (!$u1 || !$u2) {
            return $this->fail('Se necesitan los IDs de ambos usuarios (u1 y u2)');
        }

        $model = new MensajeModel();

        // Obtenemos el chat completo
        $mensajes = $model->getChatCompleto($u1, $u2);

        return $this->respond($mensajes);
    }
}
