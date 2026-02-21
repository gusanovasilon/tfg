export interface Mensaje {
  id?: number;
  conversacion_id?: number;
  remitente_id: number;
  destinatario_id?: number | null;
  cuerpo: string;
  fecha_envio?: string;
  tipo?: 'privado' | 'anuncio';
}

export interface Conversacion {
  conversacion_id: number;
  ultimo_mensaje_at: string;
  ultimo_mensaje: string;

  // Datos del "otro" usuario 
  nombre_otro: string;
  apellidos_otro: string;
  rol_otro: string;
  id_otro: number;
  deleted_at?:string;
  deleted_at_otro?:string;
}
