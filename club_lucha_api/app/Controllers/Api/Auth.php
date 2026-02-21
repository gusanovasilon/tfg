<?php namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UsuarioModel;
use App\Models\PerfilAtletaModel;
use App\Models\PerfilEntrenadorModel;

class Auth extends ResourceController
{
    // Esto hace que las respuestas sean siempre JSON 
    protected $format = 'json';

    public function login()
    {
        $datos = $this->request->getJSON();
        $email = $datos->email ?? '';
        $password = $datos->password ?? '';

        $modelo = new UsuarioModel();
        $usuario = $modelo->where('email', $email)->first();

        // Comprobar si existe y si la contraseña es correcta
        if ($usuario == null || !password_verify($password, $usuario['password'])) {
            // Si falla, devolvemos error 401 (No autorizado)
            return $this->failUnauthorized('Usuario o contraseña incorrectos');
        }

        // Funcion para poder crear los token personalizados y no emplear jwt
        // bin2hex es una funcion que convierte una cadena de datos en una cadena de hexadecimales
        $nuevoToken = bin2hex(random_bytes(32));

        // Guardamos ese token en la base de datos del usuario
        $modelo->update($usuario['id'], ['token' => $nuevoToken]);

        // =========================================================
        // BUSCAMOS LA FOTO DEL USUARIO USANDO SUS MODELOS
        // =========================================================
        $fotoUrl = 'default.png'; // Imagen por defecto si no tiene

        if ($usuario['rol'] === 'atleta') {
            $perfilModel = new PerfilAtletaModel();
            $perfil = $perfilModel->where('usuario_id', $usuario['id'])->first();
            
            if ($perfil && !empty($perfil['foto_url'])) {
                $fotoUrl = $perfil['foto_url'];
            }
        } elseif ($usuario['rol'] === 'entrenador') {
            $perfilModel = new PerfilEntrenadorModel();
            $perfil = $perfilModel->where('usuario_id', $usuario['id'])->first();
            
            if ($perfil && !empty($perfil['foto_url'])) {
                $fotoUrl = $perfil['foto_url'];
            }
        }

        // Devolvemos todos los datos, incluyendo la foto
        return $this->respond([
            'status'    => 'Login correcto',
            'id'        => $usuario['id'],
            'token'     => $nuevoToken,     
            'rol'       => $usuario['rol'], 
            'nombre'    => $usuario['nombre'], 
            'username'  => $usuario['username'], 
            'apellidos' => $usuario['apellidos'],
            'email'     => $usuario['email'],
            'foto_url'  => $fotoUrl // <--- ¡AQUÍ ESTÁ LA FOTO!
        ]);
    }

    // JWT casero
}