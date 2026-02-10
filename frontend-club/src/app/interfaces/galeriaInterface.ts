export interface GaleriaItem {
    id: number;
    titulo: string;
    imagen_url: string;
    id_categoria: number; // Esto es la clave para filtrar
}
