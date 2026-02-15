<?php

namespace App\Models;

use CodeIgniter\Model;

class PerfilEntrenadorModel extends Model
{
    protected $table            = 'perfiles_entrenadores';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $allowedFields    = ['usuario_id', 'especialidad', 'biografia', 'foto_url'];
}