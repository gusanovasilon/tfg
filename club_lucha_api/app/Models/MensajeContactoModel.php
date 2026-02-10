<?php

namespace App\Models;

use CodeIgniter\Model;

class MensajeContactoModel extends Model
{
    protected $table            = 'mensajes_formulario';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['nombre', 'email', 'asunto', 'mensaje'];
}