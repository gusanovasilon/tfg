<?php

namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
    protected $table            = 'usuarios';
    protected $primaryKey       = 'id';

    // ==========================================
    // ESTA ES LA MAGIA QUE TE FALTA O NO SE GUARDÓ:
    protected $useSoftDeletes   = true;
    protected $deletedField     = 'deleted_at';
    // ==========================================

    protected $allowedFields    = [
        'username', 'nombre', 'apellidos', 'email', 'password', 'rol', 'token', 'deleted_at'
    ];
}