// src/app/interfaces/entrenamientos.interfaces.ts

// 1. INTERFAZ PARA LAS CLASES (Entrenamientos)
export interface Entrenamiento {
    id: number;
    titulo: string;
    descripcion?: string;
    fecha_hora: string;   // Viene como string del backend "2026-02-10 18:30:00"
    ubicacion: string;
    entrenador_id: number;

    // Campos extra que vienen del JOIN con usuarios y perfiles
    nombre_entrenador?: string;
    apellido_entrenador?: string;
    foto_entrenador?: string;       // De la tabla perfiles_entrenadores
    especialidad_entrenador?: string; // De la tabla perfiles_entrenadores
}

// 2. INTERFAZ PARA LAS INSCRIPCIONES (Relación Usuario <-> Clase)
export interface Inscripcion {
    id: number;
    usuario_id: number;
    entrenamiento_id: number;
    fecha_inscripcion: string;
    asistencia: number; // 0 = No, 1 = Sí (TinyInt en SQL es number en JS)

    // Datos extra útiles para listar alumnos (Dashboard Entrenador)
    nombre_alumno?: string;
    apellidos_alumno?: string;
    peso_alumno?: number;       // Del perfil atleta
    categoria_alumno?: string;  // Del perfil atleta

    // Datos extra útiles para "Mis Clases" (Dashboard Atleta)
    titulo_clase?: string;
    fecha_clase?: string;
}
