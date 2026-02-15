import { Usuario } from "./authInterface";

export interface Ficha {
  /* Campos comunes */
    id?: number;
    usuario_id?: number;
    foto_url?: string;

    /* Campos de atletas */
    peso?: number;
    altura?: number;
    categoria?: string;

    /* Campos de enrtrenador */
    especialidad?: string;
    biografia?: string;
}

export interface FichaResponse {
    usuario: Usuario;
    ficha: Ficha;
}
