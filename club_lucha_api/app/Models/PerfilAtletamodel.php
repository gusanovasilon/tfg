<?php

namespace App\Models;

use CodeIgniter\Model;

class PerfilAtletaModel extends Model
{
    protected $table            = 'perfiles_atletas';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $allowedFields    = ['usuario_id', 'peso', 'altura', 'categoria', 'foto_url'];
}