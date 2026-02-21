<?php

namespace App\Models;

use CodeIgniter\Model;

class EntrenamientoModel extends Model
{
    protected $table            = 'entrenamientos';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['titulo', 'descripcion', 'fecha_hora', 'ubicacion', 'entrenador_id'];

    // Obtener todos los entrenamientos (futuros y pasados) con el nombre del entrenador
    public function getEntrenamientosConEntrenador()
    {
        return $this->select('entrenamientos.*, u.nombre as nombre_entrenador, u.apellidos as apellidos_entrenador')
                    ->join('usuarios u', 'u.id = entrenamientos.entrenador_id', 'left')
                    ->orderBy('entrenamientos.fecha_hora', 'ASC')
                    ->findAll();
    }
    
    // Opcional: Obtener solo los entrenamientos de un entrenador específico
    public function getMisEntrenamientos($entrenadorId)
    {
        return $this->where('entrenador_id', $entrenadorId)
                    ->orderBy('fecha_hora', 'ASC')
                    ->findAll();
    }
}