<?php 

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait; 
use App\Models\NoticiasModel;

class Noticias extends ResourceController
{
    // Activamos el Trait para tener respuestas API estándar (200, 404, 500...)
    use ResponseTrait;


    public function index()
    {
        $model = new NoticiasModel();
        
        $data = $model->getNoticias();

        if (empty($data)) {
            return $this->respond([]); 
        }

        return $this->respond($data);
    }

    public function show($id = null)
    {
        $model = new NoticiasModel();
        $data = $model->getNoticias($id);

        if (!$data) {
            return $this->failNotFound('No se encontró la noticia con ID: ' . $id);
        }

        return $this->respond($data);
    }

    
    public function create()
    {
        $model = new NoticiasModel();

        // Validamos lo básico
        $rules = [
            'titulo'    => 'required|min_length[5]',
            'contenido' => 'required',
            'autor_id'  => 'required|integer',
            // Validamos imagen: opcional, que sea imagen real, máx 2MB (2048KB)
            'imagen'    => 'permit_empty|is_image[imagen]|max_size[imagen,2048]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Recogemos datos de texto
        $data = [
            'titulo'            => $this->request->getPost('titulo'),
            'contenido'         => $this->request->getPost('contenido'),
            'autor_id'          => $this->request->getPost('autor_id'),
            // Si quieres la fecha actual:
            'fecha_publicacion' => date('Y-m-d H:i:s')
        ];

        
        $img = $this->request->getFile('imagen');

        if ($img && $img->isValid() && !$img->hasMoved()) {
            // Generar nombre aleatorio 
            $newName = $img->getRandomName();
            
            // Mover a public/uploads/noticias
            // FCPATH te lleva a la carpeta 'public'
            $img->move(FCPATH . 'uploads/noticias', $newName);
            
            // Guardar solo el nombre en BD
            $data['imagen_url'] = $newName; 
        }
        
        if ($model->insert($data)) {
            return $this->respondCreated(['status' => 'success', 'message' => 'Noticia creada']);
        } else {
            return $this->failServerError('Error al guardar en base de datos');
        }
    }

    // Para actualizar con ficheros desde Angular, se suele usar POST 
    public function update($id = null)
    {
        $model = new NoticiasModel();
        
        // Verificamos si existe la noticia
        $noticiaOriginal = $model->find($id);
        if (!$noticiaOriginal) {
            return $this->failNotFound('Noticia no encontrada');
        }

        // Recogemos datos
        $data = [
            'titulo'    => $this->request->getPost('titulo'),
            'contenido' => $this->request->getPost('contenido'),
        ];

        // Eliminamos campos vacíos (para solo editar una cosa)
        $data = array_filter($data); 

        $img = $this->request->getFile('imagen');

        if ($img && $img->isValid() && !$img->hasMoved()) {
            
            // Borramos la imagen vieja
            if (!empty($noticiaOriginal['imagen_url'])) {
                $rutaVieja = FCPATH . 'uploads/noticias/' . $noticiaOriginal['imagen_url'];
                if (file_exists($rutaVieja)) {
                    unlink($rutaVieja); // Borra el archivo físico
                }
            }

            // Subimos la imagen con el nuevo nombre
            $newName = $img->getRandomName();
            $img->move(FCPATH . 'uploads/noticias', $newName);
            
            // Actualizamos el campo en la base de datos
            $data['imagen_url'] = $newName;
        }
        

        if ($model->update($id, $data)) {
            return $this->respond(['status' => 'success', 'message' => 'Noticia actualizada']);
        } else {
            return $this->failServerError('Error al actualizar');
        }
    }

    public function delete($id = null)
    {
        $model = new NoticiasModel();
        $noticia = $model->find($id);

        if ($noticia) {
            // Borrar la imagen física si existe
            if (!empty($noticia['imagen_url'])) {
                $rutaImagen = FCPATH . 'uploads/noticias/' . $noticia['imagen_url'];
                if (file_exists($rutaImagen)) {
                    unlink($rutaImagen);
                }
            }

            // Borrar registro de la BD
            $model->delete($id);
            return $this->respondDeleted(['status' => 'success', 'message' => 'Noticia eliminada']);
        } else {
            return $this->failNotFound('No se encontró la noticia');
        }
    }
}