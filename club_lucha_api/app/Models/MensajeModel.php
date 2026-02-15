<?php

namespace App\Models;

use CodeIgniter\Model;

class MensajeModel extends Model
{
    protected $table            = 'mensajes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields    = [
        'remitente_id', 
        'destinatario_id', 
        'asunto', 
        'cuerpo', 
        'leido', 
        'tipo'  
    ];

    // =================================================================
    // 1. FUNCIÓN PRINCIPAL PARA EL USUARIO (Bandeja de Entrada + Anuncios)
    // =================================================================
 public function getMisMensajes($id)
{
    return $this->where('remitente_id', $id)
                ->orWhere('destinatario_id', $id)
                ->orderBy('fecha_envio', 'DESC')
                ->findAll();
}




    // =================================================================
    // 2. FUNCIONES PARA EL ADMINISTRADOR (Vista Espía y Borrado)
    // =================================================================
    
    // Lista de conversaciones agrupadas (quién habla con quién)
   public function getListaConversacionesAdmin()
    {
        // Seleccionamos los IDs normalizados y contamos mensajes
        $this->select('
            LEAST(remitente_id, destinatario_id) as usuario_1_id,
            GREATEST(remitente_id, destinatario_id) as usuario_2_id,
            COUNT(*) as total_mensajes,
            MAX(fecha_envio) as ultimo_mensaje
        ');

        // Seleccionamos los datos del Usuario 1 (u1)
        $this->select('u1.nombre as nombre_u1, u1.apellidos as apellidos_u1, u1.rol as rol_u1');
        
        // Seleccionamos los datos del Usuario 2 (u2)
        $this->select('u2.nombre as nombre_u2, u2.apellidos as apellidos_u2, u2.rol as rol_u2');

        // Solo mensajes privados
        $this->where('tipo', 'privado');

        // JOIN MÁGICO 1: Unimos la tabla usuarios para el ID menor
        // "on u1.id = el menor de (remitente, destinatario)"
        $this->join('usuarios u1', 'u1.id = LEAST(mensajes.remitente_id, mensajes.destinatario_id)', 'left');

        // JOIN MÁGICO 2: Unimos la tabla usuarios para el ID mayor
        // "on u2.id = el mayor de (remitente, destinatario)"
        $this->join('usuarios u2', 'u2.id = GREATEST(mensajes.remitente_id, mensajes.destinatario_id)', 'left');

        // Agrupamos por la pareja de IDs
        $this->groupBy('usuario_1_id, usuario_2_id');

        // Ordenamos por el mensaje más reciente
        $this->orderBy('ultimo_mensaje', 'DESC');

        return $this->findAll();
    }

    // Ver el chat detallado entre dos personas (Admin)
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

    // Borrar todo el chat entre dos personas
    public function borrarConversacionEntera($idUserA, $idUserB)
    {
        // Borra mensajes donde (remitente=A y destinatario=B) O (remitente=B y destinatario=A)
        return $this->groupStart()
                        ->where('remitente_id', $idUserA)->where('destinatario_id', $idUserB)
                    ->groupEnd()
                    ->orGroupStart()
                        ->where('remitente_id', $idUserB)->where('destinatario_id', $idUserA)
                    ->groupEnd()
                    ->delete();
    }
}