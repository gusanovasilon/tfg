<?php

namespace App\Models;

use CodeIgniter\Model;

class MensajeModel extends Model
{
    protected $table            = 'mensajes';
    protected $primaryKey       = 'id';

    protected $allowedFields    = [
        'conversacion_id',
        'remitente_id', 
        'destinatario_id',  
        'cuerpo', 
        'tipo'  
    ];

    // 1. BANDEJA DE ENTRADA NORMAL
    public function getMisMensajes($id)
    {
        return $this->where('remitente_id', $id)
                    ->orWhere('destinatario_id', $id)
                    ->orderBy('fecha_envio', 'DESC')
                    ->findAll();
    }

    // 2. FUNCIÓN PARA EL PANEL DEL ADMINISTRADOR (Con conversacion_id y total_mensajes)
    public function getListaConversacionesAdmin()
    {
        // Añadimos mensajes.conversacion_id para que Angular sepa qué chat abrir
        $this->select('
            mensajes.conversacion_id,
            LEAST(remitente_id, destinatario_id) as usuario_1_id,
            GREATEST(remitente_id, destinatario_id) as usuario_2_id,
            COUNT(*) as total_mensajes,
            MAX(fecha_envio) as ultimo_mensaje
        ');

        $this->select('u1.nombre as nombre_u1, u1.apellidos as apellidos_u1, u1.rol as rol_u1');
        $this->select('u2.nombre as nombre_u2, u2.apellidos as apellidos_u2, u2.rol as rol_u2');

        $this->where('tipo', 'privado');

        $this->join('usuarios u1', 'u1.id = LEAST(mensajes.remitente_id, mensajes.destinatario_id)', 'left');
        $this->join('usuarios u2', 'u2.id = GREATEST(mensajes.remitente_id, mensajes.destinatario_id)', 'left');

        // Agrupamos también por conversacion_id
        $this->groupBy('mensajes.conversacion_id, usuario_1_id, usuario_2_id');
        $this->orderBy('ultimo_mensaje', 'DESC');

        return $this->findAll();
    }

    // 3. OBTENER LOS MENSAJES ENTRE DOS PERSONAS
    public function getChatCompleto($usuarioA, $usuarioB)
    {
        return $this->select('mensajes.*, u.nombre as nombre_remitente, u.rol as rol_remitente')
                    ->join('usuarios u', 'u.id = mensajes.remitente_id')
                    ->groupStart()
                        ->where('remitente_id', $usuarioA)->where('destinatario_id', $usuarioB)
                    ->groupEnd()
                    ->orGroupStart()
                        ->where('remitente_id', $usuarioB)->where('destinatario_id', $usuarioA)
                    ->groupEnd()
                    ->orderBy('fecha_envio', 'ASC')
                    ->findAll();
    }
}