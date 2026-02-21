<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\MensajeModel;
use App\Models\ConversacionModel; 
use App\Models\UsuarioModel;

class Mensajes extends ResourceController
{
    use ResponseTrait;

    // BANDEJA DE ENTRADA
    public function index($userId = null)
    {
        if (!$userId) return $this->fail('Falta el ID del usuario en la URL');

        $usuarioModel = new UsuarioModel();
        $usuario = $usuarioModel->find($userId);

        if (!$usuario) return $this->failNotFound('Usuario no encontrado');

        $mensajeModel = new MensajeModel();
        $chatModel = new ConversacionModel();

        // AQUÍ ESTÁ LA MAGIA:
        if ($usuario['rol'] === 'admin') {
            // El admin usa el modelo de Mensajes para tener el recuento y los datos espía
            return $this->respond($mensajeModel->getListaConversacionesAdmin());
        } else {
            // El usuario normal usa el modelo de Conversaciones
            return $this->respond($chatModel->getMisConversaciones($userId));
        }
    }

    // ENVIAR MENSAJE
    public function create($idConversacionUrl = null)
    {
        $mensajeModel = new MensajeModel();
        $chatModel = new ConversacionModel();
        
        $data = $this->request->getJSON(true);
        $remitenteId = $data['remitente_id'];
        $finalConversacionId = null;

        if ($idConversacionUrl !== null) {
            $finalConversacionId = $idConversacionUrl;
            
            $chat = $chatModel->find($finalConversacionId);
            if ($chat) {
                if ($chat['usuario_1_id'] == $remitenteId) {
                    $data['destinatario_id'] = $chat['usuario_2_id'];
                } elseif ($chat['usuario_2_id'] == $remitenteId) {
                    $data['destinatario_id'] = $chat['usuario_1_id'];
                }
            }
        } else {
            if (empty($data['destinatario_id'])) {
                return $this->failValidationErrors('Falta el destinatario');
            }

            $chatIdExistente = $chatModel->obtenerIdConversacion($remitenteId, $data['destinatario_id']);

            if ($chatIdExistente) {
                $finalConversacionId = $chatIdExistente;
            } else {
                $finalConversacionId = $chatModel->crearConversacion($remitenteId, $data['destinatario_id']);
            }
        }

        if (empty($data['cuerpo']) || trim($data['cuerpo']) === '') {
            return $this->respondCreated([
                'status' => 'success',
                'conversacion_id' => $finalConversacionId,
                'mensaje' => 'Chat abierto sin mensaje inicial'
            ]);
        }

        $data['conversacion_id'] = $finalConversacionId;
        $data['fecha_envio']     = date('Y-m-d H:i:s');
        $data['tipo']            = 'privado';

        if ($mensajeModel->insert($data)) {
            $chatModel->update($finalConversacionId, ['ultimo_mensaje_at' => date('Y-m-d H:i:s')]);
            return $this->respondCreated([
                'status' => 'success',
                'conversacion_id' => $finalConversacionId
            ]);
        } else {
            return $this->failServerError('Error al guardar mensaje');
        }
    }

    // VER MENSAJES DE UN CHAT
    public function verConversacion($chatId = null)
    {
        if (!$chatId) return $this->fail('Falta ID conversación');

        $model = new MensajeModel();
        $mensajes = $model->select('mensajes.*, u.nombre as nombre_remitente')
                          ->join('usuarios u', 'u.id = mensajes.remitente_id', 'left')
                          ->where('conversacion_id', $chatId)
                          ->orderBy('fecha_envio', 'ASC')
                          ->findAll();

        return $this->respond($mensajes);
    }

    // VACIAR CONVERSACIÓN (Borra mensajes)
    public function borrarConversacion($chatId = null)
    {
        if (!$chatId) return $this->fail('Falta ID');
        
        $mensajeModel = new MensajeModel();
        
        if ($mensajeModel->where('conversacion_id', $chatId)->delete()) {
            return $this->respondDeleted([
                'status' => 'success', 
                'message' => 'Mensajes eliminados correctamente. La sala de chat sigue existiendo.'
            ]);
        }
        
        return $this->fail('Error al vaciar los mensajes de la conversación');
    }

    // DESTRUIR SALA (Borra todo)
    public function eliminarSala($chatId = null)
    {
        if (!$chatId) return $this->fail('Falta ID');
        
        $mensajeModel = new MensajeModel();
        $chatModel = new ConversacionModel();
        
        $mensajeModel->where('conversacion_id', $chatId)->delete();
        
        if ($chatModel->delete($chatId)) {
            return $this->respondDeleted([
                'status' => 'success', 
                'message' => 'Sala destruida por completo.'
            ]);
        }
        
        return $this->fail('Error al destruir la sala');
    }

    // 6. AVISO GLOBAL (Difusión)
    public function avisoGlobal()
    {
        $data = $this->request->getJSON(true);
        $remitenteId = $data['remitente_id'];
        $cuerpo = $data['cuerpo'];

        if (empty($cuerpo)) return $this->failValidationErrors('El mensaje no puede estar vacío');

        $usuarioModel = new UsuarioModel();
        $chatModel = new ConversacionModel();
        $mensajeModel = new MensajeModel();

        // 1. Obtener todos los usuarios activos (menos el admin que lo envía)
        // Como usamos Soft Deletes, findAll() ignora a los borrados automáticamente
        $usuarios = $usuarioModel->where('id !=', $remitenteId)->findAll();

        $mensajesEnviados = 0;

        // 2. Bucle de difusión masiva
        foreach ($usuarios as $user) {
            $destinatarioId = $user['id'];

            // Buscamos si ya hay carpeta de chat, si no, la creamos
            $chatId = $chatModel->obtenerIdConversacion($remitenteId, $destinatarioId);
            if (!$chatId) {
                $chatId = $chatModel->crearConversacion($remitenteId, $destinatarioId);
            }

            // Insertamos el mensaje
            $msgData = [
                'conversacion_id' => $chatId,
                'remitente_id'    => $remitenteId,
                'destinatario_id' => $destinatarioId,
                'cuerpo'          => $cuerpo,
                'tipo'            => 'anuncio', // Le ponemos la etiqueta anuncio por si en el futuro quieres darles otro color
                'fecha_envio'     => date('Y-m-d H:i:s')
            ];
            
            $mensajeModel->insert($msgData);

            // Actualizamos la hora para que el chat suba arriba del todo en la barra lateral del usuario
            $chatModel->update($chatId, ['ultimo_mensaje_at' => date('Y-m-d H:i:s')]);
            
            $mensajesEnviados++;
        }

        return $this->respondCreated([
            'status' => 'success',
            'message' => "Aviso global entregado a $mensajesEnviados miembros del club."
        ]);
    }
}