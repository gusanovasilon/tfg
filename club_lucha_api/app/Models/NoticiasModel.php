<?php namespace App\Models;

use CodeIgniter\Model;

class NoticiasModel extends Model
{
    protected $table = 'noticias';
    protected $primaryKey = 'id';
    
    protected $allowedFields = ['titulo', 'contenido', 'imagen_url', 'autor_id', 'created_at'];

    
    public function getNoticias($id = null)
    {

        $this->select('noticias.*, usuarios.nombre as autor_nombre, usuarios.apellidos as autor_apellidos');
        
        $this->join('usuarios', 'usuarios.id = noticias.autor_id', 'left');
        if ($id !== null) {
            return $this->where(['noticias.id' => $id])->first();
        }
        
        /* ordenamos de por fecha de creacion */

        return $this->orderBy('created_at', 'DESC')->findAll();
    }
}