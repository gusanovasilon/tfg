import { environment } from './../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/authService';
import { UsuariosService } from '../../../../services/usuariosService';
import { FichaService } from '../../../../services/fichaService';
import { FichaResponse } from '../../../../interfaces/fichaInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone:false,
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {

  usuario: any;
  rol: string = '';

  // OBJETO 1: DATOS DE FICHA
  // Aquí guardaremos peso, altura, biografía... todo mezclado, no pasa nada
  ficha: any = {
    peso: null,
    altura: null,
    categoria: '',
    especialidad: '',
    biografia: ''
  };

  // OBJETO 2: DATOS DE CUENTA
  // Copiaremos aquí los datos del usuario para editarlos
  datosCuenta: any = {
    nombre: '',
    apellidos: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // FOTO
  urlBaseImagen = '';
  previewUrl: string | ArrayBuffer | null = null;
  archivoSeleccionado: File | null = null;
  cargandoFicha: boolean = false;

  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private fichaService: FichaService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
    this.rol = this.usuario.rol;

    // Rellenamos los datos iniciales de la cuenta
    this.datosCuenta.nombre = this.usuario.nombre;
    this.datosCuenta.apellidos = this.usuario.apellidos;
    this.datosCuenta.username = this.usuario.username;
    this.datosCuenta.email = this.usuario.email;
    console.log(this.usuario);


    if (this.esDeportivo) {
      this.cargarFicha();
    }
  }

  get esDeportivo(): boolean {
    return this.rol === 'atleta' || this.rol === 'entrenador';
  }

  cargarFicha() {
    this.cargandoFicha = true;

    // Configurar URL base
    if (this.rol === 'atleta') {
      this.urlBaseImagen = environment.imgBaseUrl + 'atletas/';
    } else {
      this.urlBaseImagen = environment.imgBaseUrl + 'entrenadores/';
    }

    this.fichaService.getFicha(this.usuario.id).subscribe({
      next: (resp: FichaResponse) => {
        if (resp.ficha) {
          // Copiamos los datos que vinieron del servidor a nuestro objeto local
          this.ficha = { ...this.ficha, ...resp.ficha };

          if (resp.ficha.foto_url) {
            this.previewUrl = this.urlBaseImagen + resp.ficha.foto_url;
          }
        }
        this.cargandoFicha = false;
      },
      error: (err) => {
        console.error(err);
        this.cargandoFicha = false;
      }
    });
  }

  // --- SELECCIÓN DE FOTO ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // --- GUARDAR CUENTA (ngSubmit) ---
  guardarCuenta(form: any) {
    // 1. Validar validez general del HTML (required, email, minlength)
    if (form.invalid) {
      Swal.fire('Error', 'Revisa los campos en rojo', 'error');
      return;
    }

    // 2. Validar contraseñas manualmente (es más fácil de explicar)
    if (this.datosCuenta.password || this.datosCuenta.confirmPassword) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!regex.test(this.datosCuenta.password)) {
            Swal.fire('Error', 'La contraseña debe tener 6 caracteres, letras y números', 'error');
             return;
        }
        if (this.datosCuenta.password !== this.datosCuenta.confirmPassword) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }
    }

    // Enviamos
    this.usuariosService.updateUsuario(this.usuario.id, this.datosCuenta).subscribe({
      next: (resp: any) => {
        Swal.fire('Éxito', 'Cuenta actualizada', 'success');
        if (resp.usuario) {

          this.authService.guardarSesion(resp.usuario);
          console.log(this.authService.usuario);
        }
        // Limpiamos los campos de contraseña
        this.datosCuenta.password = '';
        this.datosCuenta.confirmPassword = '';
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
  }

  // --- GUARDAR FICHA (ngSubmit) ---
  guardarFicha(form: any) {
    if (form.invalid) {
      Swal.fire('Atención', 'Completa los campos obligatorios', 'warning');
      return;
    }

    const formData = new FormData();

    // Añadimos campos manualmente según el rol
    if (this.rol === 'atleta') {
        formData.append('peso', this.ficha.peso);
        formData.append('altura', this.ficha.altura);
        formData.append('categoria', this.ficha.categoria);
    } else {
        formData.append('especialidad', this.ficha.especialidad);
        formData.append('biografia', this.ficha.biografia);
    }

    if (this.archivoSeleccionado) {
      formData.append('foto', this.archivoSeleccionado);
    }

    this.fichaService.updateFicha(this.usuario.id, formData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Ficha actualizada', 'success');
        this.archivoSeleccionado = null;
      },
      error: () => Swal.fire('Error', 'No se pudo guardar la ficha', 'error')
    });
  }
}
