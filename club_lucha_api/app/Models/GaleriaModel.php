<?php

namespace App\Models;

use CodeIgniter\Model;

class GaleriaModel extends Model
{
    protected $table            = 'galeria';      
    protected $primaryKey       = 'id';   
    protected $allowedFields    = ['titulo', 'imagen_url', 'id_categoria', ];

    public function getGaleriaConCategoria()
    {
        return $this->select('galeria.*, categorias_galeria.nombre as nombre_categoria')
                    ->join('categorias_galeria', 'categorias_galeria.id = galeria.id_categoria')
                    ->findAll();
    }
}