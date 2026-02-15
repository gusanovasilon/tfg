<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UsuarioModel;
use Config\Services;

class Usuarios extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    
    public function index()
    {
        $model = new UsuarioModel();
        $usuarios = $model->findAll();

        // Limpiamos contraseñas por seguridad
        foreach ($usuarios as &$usuario) {
            unset($usuario['password']);
        }

        return $this->respond($usuarios);
    }

    // POST: api/usuarios
    public function create()
    {
        $model = new UsuarioModel();
        
        // 1. Recoger datos del JSON
        $data = $this->request->getJSON(true);

        // 2. Reglas de Validación (Password es OBLIGATORIA aquí)
        $rules = [
            'nombre'    => 'required|min_length[2]',
            'apellidos' => 'required|min_length[2]',
            'email'     => 'required|valid_email|is_unique[usuarios.email]',
            'username'  => 'permit_empty|is_unique[usuarios.username]',
            'password'  => 'required|min_length[4]',
            'rol'       => 'required|in_list[admin,entrenador,atleta,escritor]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // 3. Hash de la contraseña
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        // 4. Insertar en la Base de Datos
        // El método insert devuelve el ID del nuevo registro si sale bien
        $nuevoId = $model->insert($data);

        if ($nuevoId) {
            // 5. Devolvemos el ID y los datos (sin password)
            // Esto es CRUCIAL para que Angular sepa qué ID usar para guardar la ficha después
            $usuarioCreado = $model->find($nuevoId);
            unset($usuarioCreado['password']);

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Usuario creado correctamente',
                'id' => $nuevoId,  // <--- Angular necesita esto
                'usuario' => $usuarioCreado
            ]);
        } else {
            return $this->failServerError('No se pudo crear el usuario');
        }
    }

    
    public function update($id = null)
    {
        $model = new UsuarioModel();
        
        // Verificamos que exista
        if (!$model->find($id)) {
            return $this->failNotFound('Usuario no encontrado');
        }

        // Recogemos el JSON 
        $data = $this->request->getJSON(true);

        // Reglas de validación para tabla 'usuarios'
        $rules = [
            'nombre'    => 'permit_empty|min_length[2]',
            'apellidos' => 'permit_empty|min_length[2]',
            'email'     => "permit_empty|valid_email|is_unique[usuarios.email,id,{$id}]",
            'username'  => "permit_empty|min_length[3]|is_unique[usuarios.username,id,{$id}]",
            'rol'       => 'permit_empty|in_list[admin,entrenador,atleta,escritor]',
            'password'  => 'permit_empty|min_length[4]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // encriptamos la contraseña por si enviaan una nueva contraseña si la envían
        if (!empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            // Si viene vacía, la quitamos para no sobreescribirla 
            unset($data['password']);
        }

        if ($model->update($id, $data)) {
            
            $usuarioActualizado = $model->find($id);
            unset($usuarioActualizado['password']);

            return $this->respond([
                'status'  => 'success',
                'message' => 'Datos de cuenta actualizados',
                'usuario' => $usuarioActualizado
            ]);
        } else {
            return $this->failServerError('No se pudo actualizar la base de datos');
        }
    }

    
    public function delete($id = null)
    {
        $model = new UsuarioModel();
        
        if ($model->delete($id)) {
        
            return $this->respondDeleted(['status' => 'success', 'message' => 'Usuario eliminado']);
        } else {
            return $this->failNotFound('Usuario no encontrado');
        }
    }
}