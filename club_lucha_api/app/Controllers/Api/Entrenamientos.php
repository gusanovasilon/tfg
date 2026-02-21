<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\EntrenamientoModel;
use App\Models\InscripcionModel;

class Entrenamientos extends ResourceController
{
    use ResponseTrait;

    // =========================================================
    // 1. LISTAR TODOS LOS ENTRENAMIENTOS (Tablón general)
    // =========================================================
   public function index()
    {
        $entrenamientoModel = new EntrenamientoModel();
        $entrenamientos = $entrenamientoModel->getEntrenamientosConEntrenador();
        
        // Todos por defecto van con apuntado = false
        foreach ($entrenamientos as &$entreno) {
            $entreno['apuntado'] = false;
        }

        return $this->respond($entrenamientos);
    }

    // =========================================================
    // 1.B. LISTAR ENTRENAMIENTOS PARA UN ATLETA (Cruza los datos)
    // =========================================================
    public function tablonAtleta($usuarioId = null)
    {
        if (!$usuarioId) return $this->fail('Falta el ID del usuario');

        $entrenamientoModel = new EntrenamientoModel();
        $inscripcionModel = new InscripcionModel();
        
        // Sacamos TODOS los entrenamientos
        $entrenamientos = $entrenamientoModel->getEntrenamientosConEntrenador();
        
        // Buscamos a cuáles está apuntado este atleta en concreto
        $misInscripciones = $inscripcionModel->getMisInscripciones($usuarioId);
        $idsApuntados = array_column($misInscripciones, 'entrenamiento_id');
        
        // Marcamos con true o false
        foreach ($entrenamientos as &$entreno) {
            $entreno['apuntado'] = in_array($entreno['id'], $idsApuntados);
        }

        return $this->respond($entrenamientos);
    }

    // =========================================================
    // 2. CREAR UN NUEVO ENTRENAMIENTO (Solo Entrenadores)
    // =========================================================
    // =========================================================
    // 2. CREAR UN NUEVO ENTRENAMIENTO (Solo Entrenadores)
    // =========================================================
    public function create()
    {
        $model = new EntrenamientoModel();
        $data = $this->request->getJSON(true);

        // 1. Reglas básicas de CodeIgniter
        $rules = [
            'titulo'        => 'required|min_length[3]',
            'fecha_hora'    => 'required|valid_date',
            'entrenador_id' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        

        // 2. Comprobar que la fecha no sea en el pasado
        if (strtotime($data['fecha_hora']) < time()) {
            return $this->fail('Seguridad: No puedes crear entrenamientos en el pasado.');
        }

        // 3. Comprobar solapamientos (Mismo entrenador, misma fecha/hora exacta)
        $solapamiento = $model->where('entrenador_id', $data['entrenador_id'])
                              ->where('fecha_hora', $data['fecha_hora'])
                              ->first();

        if ($solapamiento) {
            return $this->fail('Seguridad: Ya existe una sesión tuya en ese horario exacto.');
        }

        // -----------------------------------------

        // Si pasa todos los filtros, lo guardamos en la base de datos
        if ($model->insert($data)) {
            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Sesión de entrenamiento creada'
            ]);
        }

        return $this->failServerError('Error al crear la sesión');
    }

    // =========================================================
    // ACTUALIZAR UN ENTRENAMIENTO
    // =========================================================
    public function update($id = null)
    {
        $model = new EntrenamientoModel();
        $data = $this->request->getJSON(true);

        // Verificar que el entrenamiento existe
        $entrenamientoExistente = $model->find($id);
        if (!$entrenamientoExistente) {
            return $this->failNotFound('El entrenamiento no existe.');
        }

        // 1. Reglas básicas
        $rules = [
            'titulo'     => 'required|min_length[3]',
            'fecha_hora' => 'required|valid_date',
            'ubicacion'  => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // --- BARRERAS DE SEGURIDAD DEL BACKEND ---

        // 2. Comprobar que la fecha no sea en el pasado
        if (strtotime($data['fecha_hora']) < time()) {
            return $this->fail('Seguridad: No puedes mover un entrenamiento al pasado.');
        }

        // 3. Comprobar solapamientos (Mismo entrenador, misma fecha, distinto ID)
        $solapamiento = $model->where('entrenador_id', $entrenamientoExistente['entrenador_id'])
                              ->where('fecha_hora', $data['fecha_hora'])
                              ->where('id !=', $id) // Excluimos el entrenamiento actual
                              ->first();

        if ($solapamiento) {
            return $this->fail('Seguridad: Ya tienes otra sesión en ese horario exacto.');
        }

        // -----------------------------------------

        if ($model->update($id, $data)) {
            return $this->respondUpdated([
                'status' => 'success',
                'message' => 'Entrenamiento actualizado correctamente'
            ]);
        }

        return $this->failServerError('Error al actualizar la sesión');
    }

    
    public function delete($id = null)
    {
        $model = new EntrenamientoModel();
        
        // Al borrar esto, el "ON DELETE CASCADE" de tu BD borrará automáticamente a todos los inscritos
        if ($model->delete($id)) {
            return $this->respondDeleted(['status' => 'success', 'message' => 'Entrenamiento cancelado']);
        }
        
        return $this->failNotFound('Entrenamiento no encontrado');
    }

    // =========================================================
    // 4. APUNTARSE / DESAPUNTARSE (Botón Toggle del Atleta)
    // =========================================================
    public function toggleInscripcion()
    {
        $inscripcionModel = new InscripcionModel();
        $entrenamientoModel = new EntrenamientoModel();
        $data = $this->request->getJSON(true);
        
        $usuarioId = $data['usuario_id'] ?? null;
        $entrenamientoId = $data['entrenamiento_id'] ?? null;

        if (!$usuarioId || !$entrenamientoId) {
            return $this->failValidationErrors('Faltan datos para la inscripción');
        }

        // ¿Ya está apuntado?
        $existe = $inscripcionModel->verificarInscripcion($usuarioId, $entrenamientoId);
        $entrenamiento = $entrenamientoModel-> find($entrenamientoId);
        //miramos que existta el entrenamiento
        if (!$entrenamiento) return $this->failNotFound('El entrenamiento no existe');
        //comparamos la fecha del entrenamiento con la fecha actual
        if (strtotime($entrenamiento['fecha_hora']) < time()) {
            return $this->fail('No puedes apuntarte ni desapuntarte de un entrenamiento que ya ha finalizado.');
        }

        if ($existe) {
            // Si ya estaba apuntado, lo borramos (Cancelar inscripción)
            $inscripcionModel->delete($existe['id']);
            return $this->respondDeleted([
                'status' => 'success', 
                'message' => 'Te has desapuntado de la clase', 
                'apuntado' => false
            ]);
        } else {
            // Si no estaba, lo metemos en la tabla
            $inscripcionModel->insert([
                'usuario_id' => $usuarioId,
                'entrenamiento_id' => $entrenamientoId,
                'asistencia' => 0 // Por defecto no ha asistido aún
            ]);
            return $this->respondCreated([
                'status' => 'success', 
                'message' => 'Te has apuntado a la clase', 
                'apuntado' => true
            ]);
        }
    }

    // =========================================================
    // 5. VER LA LISTA DE APUNTADOS (Para el Entrenador)
    // =========================================================
    public function asistentes($idEntrenamiento = null)
    {
        if (!$idEntrenamiento) return $this->fail('Falta el ID del entrenamiento');

        $inscripcionModel = new InscripcionModel();
        $asistentes = $inscripcionModel->getAtletasInscritos($idEntrenamiento);

        return $this->respond($asistentes);
    }

    // =========================================================
    // 6. PASAR LISTA (Marcar el check de Asistencia)
    // =========================================================
    public function pasarLista($idInscripcion = null)
    {
        $inscripcionModel = new InscripcionModel();
        $data = $this->request->getJSON(true); 

        // Esperamos recibir { "asistencia": 1 } o { "asistencia": 0 }
        if (!$idInscripcion || !isset($data['asistencia'])) {
            return $this->fail('Datos incompletos');
        }

        if ($inscripcionModel->update($idInscripcion, ['asistencia' => $data['asistencia']])) {
            return $this->respond(['status' => 'success', 'message' => 'Asistencia guardada']);
        }

        return $this->failServerError('Error al pasar lista');
    }
}