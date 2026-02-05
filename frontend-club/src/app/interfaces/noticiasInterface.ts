export interface Noticia {
    id: number;
    titulo: string;
    contenido: string;
    imagen_url?: string;
    created_at: string; // CodeIgniter devuelve la fecha como string
    autor_id: number;
    autor_nombre?: string;
    autor_apellidos?: string;
}


