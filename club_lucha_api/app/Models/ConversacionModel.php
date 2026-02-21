<?php

namespace App\Models;

use CodeIgniter\Model;

class ConversacionModel extends Model
{
    protected $table            = 'conversaciones';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['usuario_1_id', 'usuario_2_id',  'ultimo_mensaje_at'];

    // 1. Busca si ya existe una carpeta entre dos personas
    public function obtenerIdConversacion($u1, $u2)
    {
        $sql = "SELECT id FROM conversaciones 
                WHERE (usuario_1_id = ? AND usuario_2_id = ?) 
                   OR (usuario_1_id = ? AND usuario_2_id = ?) 
                LIMIT 1";
        
        $query = $this->db->query($sql, [$u1, $u2, $u2, $u1]);
        $row = $query->getRow();

        return $row ? $row->id : null;
    }

    // 2. Crea una carpeta nueva y devuelve el ID
    public function crearConversacion($u1, $u2)
    {
        $data = [
            'usuario_1_id' => $u1,
            'usuario_2_id' => $u2,
            'ultimo_mensaje_at' => date('Y-m-d H:i:s')
        ];

        $this->insert($data);
        return $this->insertID(); 
    }

    // 3. Tu función para listar los chats de un usuario normal
    public function getMisConversaciones($miId)
    {
        $id = (int) $miId;
        
        $this->select('c.id as conversacion_id, c.ultimo_mensaje_at');
        $this->select("CASE WHEN c.usuario_1_id = $id THEN u2.nombre ELSE u1.nombre END as nombre_otro", false);
        $this->select("CASE WHEN c.usuario_1_id = $id THEN u2.apellidos ELSE u1.apellidos END as apellidos_otro", false);
        $this->select("CASE WHEN c.usuario_1_id = $id THEN u2.rol ELSE u1.rol END as rol_otro", false);
        $this->select("CASE WHEN c.usuario_1_id = $id THEN u2.id ELSE u1.id END as id_otro", false);
        
        // ¡NUEVO!: Traemos el deleted_at de la otra persona para saber si está borrada
        $this->select("CASE WHEN c.usuario_1_id = $id THEN u2.deleted_at ELSE u1.deleted_at END as deleted_at_otro", false);
        
        $this->select('(SELECT cuerpo FROM mensajes WHERE conversacion_id = c.id ORDER BY fecha_envio DESC LIMIT 1) as ultimo_mensaje', false);

        $this->from('conversaciones c');
        // Usamos LEFT JOIN para que aunque estén borrados lógicamente, la BD los siga cruzando
        $this->join('usuarios u1', 'c.usuario_1_id = u1.id', 'left');
        $this->join('usuarios u2', 'c.usuario_2_id = u2.id', 'left');

        $this->groupStart()->where('c.usuario_1_id', $id)->orWhere('c.usuario_2_id', $id)->groupEnd();
        
        $this->groupBy('c.id');
        $this->orderBy('c.ultimo_mensaje_at', 'DESC');

        return $this->findAll();
    }
}