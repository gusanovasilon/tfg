import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginData, LoginResponse, Usuario } from '../interfaces/authInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl
  private readonly TOKEN_KEY = 'token_club';
  private readonly USER_KEY = 'user_data';   // Nombre de la llave para guardar los datos del usuario

  constructor(private http: HttpClient) { }


/* FUNCIONES DE LOGIN Y LOGOUT */

  /* Recibe los parametros de tipo LoginData (email y password) y va arecibir un observable de tipo LoginResponse con todos los datos en formato JSON del usuario */
  login(credentials: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        // El operador 'tap' de rxjs nos permite ejecutar código sin alterar la respuesta del Observable
        // En cuanto llega la respuesat exitosa lanzamos la funcion guardarSesion que nos guarda el token recibido del usuario en el localStorage.
        tap((response) => {
          if (response.token) {
            this.guardarSesion(response);
          }
        })
      );
  }

  // Función Logout: Borra todo rastro del usuario del navegador.
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }


  // FUNCION PRIVADA QUE RECIBE COMO PARAMETRO LA RESPUESTA DEL OBSERVABLE CON LOS DATOS DEL USUARIO

  /* Esta respuesta lleva en data.token el token recibido desde CI y lo guardamos como token_club en el localStorage.
  Tambien creamos un objeto usuario con todos los datos recibidos menos el token */

  /* FUNCION NECESARIA PARA QUE CUANDO RECARGUEMOS LA PAGINA POR ALGUN CASUAL NO PERDER LOS DATOS DE LA SESION  */
  private guardarSesion(data: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    const usuario: Usuario = {
      id: data.id,
      username: data.username,
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      rol: data.rol
    };

    // Guardamos el objeto creado en el localstorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
  }

  // Recuperar el Token (útil para enviarlo en las cabeceras de las peticiones)
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Recuperar los datos del usuario (Nombre, ID, Rol...) ya convertidos en Objeto.
  get usuario(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  //Comprobacion rapida de si el usuario está logueado preguntando por el token
  get estaAutenticado(): any {
    console.log(this.token)
    if (this.token) return true;
  }

/* Saber de manera rapida el rol para poder crear html personalizado con @if y recuperar los datos de sesion del usuario */

//Administrador
  get esAdmin(): boolean {
    return this.usuario?.rol === 'admin';
  }

//Entrenador
  get esEntrenador(): boolean {
    return this.usuario?.rol === 'entrenador';
  }

//Atleta
  get esAtleta(): boolean {
    return this.usuario?.rol === 'atleta';
  }

//Escritor
  get esEscritor(): boolean {
    return this.usuario?.rol === 'escritor';
  }

}
