import { Component } from '@angular/core';
import { AuthService } from '../../../services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
credenciales = {
    email: '',
    password: ''
  };

  cargando: boolean = false;

  // AQUÍ GUARDAMOS LA LISTA DE PROBLEMAS
  errores: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // 1. Limpiamos errores previos
    this.errores = [];

    // 2. Validamos antes de llamar al servidor
    if (!this.validarCampos()) {
      return; // Si hay errores, paramos aquí.
    }

    this.cargando = true;

    this.authService.login(this.credenciales).subscribe({
      next: (res) => {
        // Login correcto
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error login:', err);
        this.cargando = false;
        // Si falla el servidor (contraseña mal), lo añadimos al array
        this.errores.push('El email o la contraseña son incorrectos.');
      }
    });
  }

  logout (){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // --- TU NUEVA FUNCIÓN DE VALIDACIÓN ---
  validarCampos(): boolean {

    // Validar Email vacio
    if (!this.credenciales.email.trim()) {
      this.errores.push('El campo email es obligatorio.');
    }
    // Validar formato Email (si no está vacío)
    else if (!this.credenciales.email.includes('@')) {
      this.errores.push('El formato del email no es válido.');
    }

    // Validar Contraseña vacía
    if (!this.credenciales.password.trim()) {
      this.errores.push('La contraseña es obligatoria.');
    }

    // Si el array tiene longitud 0, es que todo está bien (true)
    // Si tiene algo (length > 0), devolvemos false.
    return this.errores.length === 0;
  }
}

