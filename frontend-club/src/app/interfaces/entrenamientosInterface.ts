
export interface Entrenamiento {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha_hora: string;
  ubicacion: string;
  entrenador_id: number;

  // Datos del LEFT JOIN con la tabla usuarios
  nombre_entrenador?: string;
  apellidos_entrenador?: string;

  // Campo dinámico que creamos en el backend para saber si el atleta actual está inscrito
  apuntado?: boolean;
}

// =======================================================
// INTERFAZ DE LA LISTA DE ASISTENTES (Para el Entrenador)
// =======================================================
export interface Asistente {
  id: number;  //id de la tabla inscripciones
  usuario_id: number;
  entrenamiento_id: number;
  fecha_inscripcion: string;
  asistencia: number; // 0 o 1

  // Datos del JOIN con usuarios y perfiles_atletas
  nombre: string;
  apellidos: string;
  foto_url?: string;
}
