<?php

namespace App\Models;

use CodeIgniter\Model;

class InscripcionModel extends Model
{
    protected $table            = 'inscripciones';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['usuario_id', 'entrenamiento_id', 'fecha_inscripcion', 'asistencia'];

    // Para el ATLETA: Saber a qué clases está apuntado
    public function getMisInscripciones($usuarioId)
    {
        return $this->where('usuario_id', $usuarioId)->findAll();
    }

    // Para el ENTRENADOR: Sacar la lista de alumnos apuntados a su clase para pasar lista
    public function getAtletasInscritos($entrenamientoId)
    {
        return $this->select('inscripciones.*, u.nombre, u.apellidos, pa.foto_url')
                    ->join('usuarios u', 'u.id = inscripciones.usuario_id', 'inner')
                    ->join('perfiles_atletas pa', 'pa.usuario_id = u.id', 'left')
                    ->where('inscripciones.entrenamiento_id', $entrenamientoId)
                    ->findAll();
    }
    
    // Función rápida para comprobar si un atleta ya está apuntado a una clase concreta
    public function verificarInscripcion($usuarioId, $entrenamientoId)
    {
        return $this->where('usuario_id', $usuarioId)
                    ->where('entrenamiento_id', $entrenamientoId)
                    ->first();
    }
}