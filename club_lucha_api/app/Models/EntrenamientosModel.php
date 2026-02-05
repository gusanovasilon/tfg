<?php namespace App\Models;

use CodeIgniter\Model;

class EntrenamientoModel extends Model
{
    protected $table = 'entrenamientos';
    protected $primaryKey = 'id';
    
    protected $allowedFields = ['titulo', 'descripcion', 'fecha_hora', 'ubicacion', 'entrenador_id'];

    public function getClases($id = null, $soloFuturas = false)
    {
        
        $this->select('
            entrenamientos.*, 
            usuarios.nombre as nombre_entrenador, 
            usuarios.apellidos as apellido_entrenador,
            perfiles_entrenadores.foto_url as foto_entrenador,
            perfiles_entrenadores.especialidad as especialidad_entrenador
        ');
        
        // JOIN con Usuarios (Para el nombre)
        $this->join('usuarios', 'usuarios.id = entrenamientos.entrenador_id', 'left');
        
        // JOIN con Perfiles (Para la foto y especialidad)
   
        $this->join('perfiles_entrenadores', 'perfiles_entrenadores.usuario_id = usuarios.id', 'left');

        if ($id !== null) {
            return $this->where(['entrenamientos.id' => $id])->first();
        }

        //Para ver solo los entrenamientos que vienen y no los que hayan pasado ya de fecha
        if ($soloFuturas) {
            $this->where('fecha_hora >=', date('Y-m-d H:i:s'));
        }

        // Ordenar por fecha, lo más próximo primero
        return $this->orderBy('fecha_hora', 'ASC')->findAll();
    }
}