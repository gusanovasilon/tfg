<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UsuarioModel;
use App\Models\PerfilAtletaModel;
use App\Models\PerfilEntrenadorModel;

class FichaDeportiva extends ResourceController
{
    use ResponseTrait;

    // GET: api/fichadeportiva/(:num)
    // Devuelve los datos combinados (Usuario + Ficha)
    public function show($id = null)
    {
        $userModel = new UsuarioModel();
        $usuario = $userModel->find($id);

        if (!$usuario) {
            return $this->failNotFound('Usuario no encontrado');
        }

        $ficha = null;

        // Buscamos la ficha según el rol
        if ($usuario['rol'] === 'atleta') {
            $perfilModel = new PerfilAtletaModel();
            $ficha = $perfilModel->where('usuario_id', $id)->first();
        } elseif ($usuario['rol'] === 'entrenador') {
            $perfilModel = new PerfilEntrenadorModel();
            $ficha = $perfilModel->where('usuario_id', $id)->first();
        }

        // Si no tiene ficha creada aún (puede pasar en registros nuevos), devolvemos array vacío
        // para que Angular no falle, pero indicando que es usuario válido.
        $respuesta = [
            'usuario' => [
                'id' => $usuario['id'],
                'nombre' => $usuario['nombre'],
                'apellidos' => $usuario['apellidos'],
                'email' => $usuario['email'],
                'rol' => $usuario['rol']
            ],
            'ficha' => $ficha ? $ficha : [] // Devolvemos la ficha o vacío
        ];

        return $this->respond($respuesta);
    }

    // POST: api/fichadeportiva/(:num)
    // Actualiza la ficha técnica y la foto
    public function update($id = null)
    {
        $userModel = new UsuarioModel();
        $usuario = $userModel->find($id);

        if (!$usuario) return $this->failNotFound('Usuario no encontrado');

        $rol = $usuario['rol'];
        $rules = [];
        
        // Si es Admin o Escritor, no tienen ficha deportiva, devolvemos error o ignoramos
        if ($rol !== 'atleta' && $rol !== 'entrenador') {
            return $this->failValidationErrors('Este rol no tiene ficha deportiva.');
        }

        /* validaciones simples del formulario de los entrenadors y atletas */
        if ($rol === 'atleta') {
            $rules['peso']      = 'required|numeric|greater_than[0]';
            $rules['altura']    = 'required|integer|greater_than[0]';
            $rules['categoria'] = 'required|min_length[3]';
        } 
        elseif ($rol === 'entrenador') {
            $rules['especialidad'] = 'required|min_length[3]';
            $rules['biografia']    = 'required|min_length[10]';
        } 
        else {
            return $this->failValidationErrors('Este usuario (Admin/Escritor) no tiene ficha deportiva.');
        }

        // --- LÓGICA COMÚN DE IMAGEN ---
        $img = $this->request->getFile('foto');
        $nombreFoto = null;
        $carpetaDestino = ($rol === 'atleta') ? 'uploads/atletas' : 'uploads/entrenadores';

        // Validar imagen
        if ($img && $img->isValid() && !$img->hasMoved()) {
            
            $nombreFoto = $img->getRandomName();
            $img->move(FCPATH . $carpetaDestino, $nombreFoto);
            
            // Aquí deberíamos borrar la foto vieja, pero primero necesitamos saber cuál es.
            // Lo haremos dentro del IF de cada rol.
        }

        // --- LÓGICA ESPECÍFICA POR ROL ---
        
        if ($rol === 'atleta') {
            return $this->gestionarAtleta($id, $nombreFoto, $carpetaDestino);
        } else {
            return $this->gestionarEntrenador($id, $nombreFoto, $carpetaDestino);
        }
    }
    
/* funciones privadas para la gestion de las imagenes  */
    private function gestionarAtleta($userId, $nuevaFoto, $carpeta)
    {
        $model = new PerfilAtletaModel();
        $perfilActual = $model->where('usuario_id', $userId)->first();

        // Datos del Formulario (Validación previa hecha en update)
        $data = [
            'peso'      => $this->request->getPost('peso'),
            'altura'    => $this->request->getPost('altura'),
            'categoria' => $this->request->getPost('categoria'),
        ];

        if ($nuevaFoto) {
            // Borramos la imagen vieja
            if ($perfilActual && !empty($perfilActual['foto_url'])) {
                
                $nombreFotoVieja = $perfilActual['foto_url'];
                // Construimos la ruta física completa:
                // FCPATH (public/) + uploads/atletas/ + nombre
                $rutaVieja = FCPATH . $carpeta . '/' . $nombreFotoVieja;
                if (file_exists($rutaVieja)) {
                    unlink($rutaVieja);
                }
            }
            $data['foto_url'] = $nuevaFoto; 
        }

        // INSERT O UPDATE
        if ($perfilActual) {
            $model->update($perfilActual['id'], $data);
        } else {
            // Primera vez
            $data['usuario_id'] = $userId;
            // Si no sube foto, asignamos el nombre del default
            if (!isset($data['foto_url']) || $data['foto_url'] == "") {
                $data['foto_url'] = 'default.png'; 
            }
            $model->insert($data);
        }

        return $this->respond(['status' => 'success', 'message' => 'Ficha de atleta actualizada']);
    }

    private function gestionarEntrenador($userId, $nuevaFoto, $carpeta)
{
    $model = new PerfilEntrenadorModel();
    $perfilActual = $model->where('usuario_id', $userId)->first();

    
    $data = [
        'especialidad' => $this->request->getPost('especialidad'),
        'biografia'    => $this->request->getPost('biografia'),
    ];

    if ($nuevaFoto) {
        
        // --- Lógica de BORRADO de la vieja ---
        if ($perfilActual && !empty($perfilActual['foto_url'])) {
            
            $nombreFotoVieja = $perfilActual['foto_url'];

            // Construimos la ruta física: public/uploads/entrenadores/foto.jpg
            $rutaVieja = FCPATH . $carpeta . '/' . $nombreFotoVieja;

            // Solo borramos si el archivo EXISTE
            if (file_exists($rutaVieja)) {
                unlink($rutaVieja);
            }
        }

        $data['foto_url'] = $nuevaFoto;
    }

    if ($perfilActual) {
        $model->update($perfilActual['id'], $data);
    } else {
        // Primera vez que se crea el perfil
        $data['usuario_id'] = $userId;
        
        // Si se crea sin subir foto, asignamos el default
        if (!isset($data['foto_url'])  || $data['foto_url'] == "") {
            $data['foto_url'] = 'default.png';
        }
        
        $model->insert($data);
    }

    return $this->respond(['status' => 'success', 'message' => 'Perfil de entrenador actualizado']);
}
}