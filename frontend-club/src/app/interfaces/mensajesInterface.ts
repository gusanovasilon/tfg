// Estructura de un Mensaje individual (Bandeja de entrada / Chat detallado)
export interface Mensaje {
  id?: number;
  remitente_id: number;
  destinatario_id: number; // Si es 0, es un anuncio global
  asunto?: string;
  cuerpo: string;
  leido?: number;    // 0 o 1
  tipo?: 'privado' | 'anuncio';
  fecha_envio?: string;

  // Campos extra que vienen de los JOINs en PHP (nombres de la gente)
  nombre_remitente?: string;
  apellidos_remitente?: string;
  rol_remitente?: string;

  nombre_destinatario?: string; // A veces viene como 'nombre_otro' según tu modelo, ajústalo si hace falta
}

// Estructura para la lista "Espía" del Administrador
// (Muestra quién habla con quién, pero no el texto)
export interface ConversacionAdmin {
  usuario_1_id: number;
  usuario_2_id: number;
  total_mensajes: number;
  ultimo_mensaje: string;

  // Datos del Usuario 1
  nombre_u1: string;
  rol_u1: string;

  // Datos del Usuario 2
  nombre_u2: string;
  rol_u2: string;
}
