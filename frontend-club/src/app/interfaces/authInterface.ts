
/* Interfaces que voy a emplear para poder tipar la informacion del logueo sino es todo un lio con los any */

/* definimos los posibles tipos del rol de usuario */
export type RolUsuario = 'admin' | 'atleta' | 'escritor' | 'entrenador';


/* Interfaz de usuario, id lo dejamos como no obligatorio ya que no siempre lo voy a necesitar */
export interface Usuario {
    id: number;
    nombre: string;
    apellidos:string;
    username:string;
    email: string;
    rol: RolUsuario;
    password?:string;
}

/* datos de logueo */
export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    token: string;
    rol: RolUsuario;
    id: number;
    username: string;
    nombre: string;
    apellidos: string;
    email: string;
}
