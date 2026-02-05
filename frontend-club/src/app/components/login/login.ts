
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../../interfaces/authInterface'; // <--- Importamos la interfaz para tipado fuerte
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone:false,
  styleUrls: ['./login.css']
})
export class LoginComponent {

/* Pasamos las credenciales de tipo LoginData */
  credenciales: LoginData = {
    email: '',
    password: ''
  };

  /* Inicializamos un mensaje de error vacio en el caso de que haya algun error al loguearse poder mostrarlo */
  mensajeError: string = '';

  // Inyectamos AuthService y Router

  /* Router es necesario para poder redirigir en funcion de lo que recibamos
  es el que nos permite usar la funcion navigate */
  constructor(private auth: AuthService, private router: Router) { }

  loguearse() {
    this.mensajeError = ''; // Limpiamos errores previos en caso de que haya alguno

    this.auth.login(this.credenciales).subscribe({
      /* nos suscribimos a la funcion login del AuthService que nos guarda directamente todos los datos en el localStorage gracias al operador tap , eso nos permite usar la redireccion empleando los getters */
      next: (respuesta) => {
        console.log('Login exitoso:', respuesta);
        if (this.auth.esEntrenador) {
          this.router.navigate(['/dashboard-entrenador']);
        }
        else if (this.auth.esAtleta) {
          this.router.navigate(['/dashboard-atleta']);
        }
        else if (this.auth.esEscritor) {
          this.router.navigate(['/noticias']);
        }
        else {
          /* Si el rol no coincide con ninguno de los getters lo redirigimos al index */
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        // Si hay error lo añadimos a nuestra variable y lo mostramos
        this.mensajeError = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
