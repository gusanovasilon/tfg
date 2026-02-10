import { Component } from '@angular/core';
import { MensajeContacto } from '../../interfaces/mensajeContactoInterface';
import { ContactoService } from '../../services/contactoService';

@Component({
  selector: 'app-contacto',
  standalone: false,
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {


  datosFormulario: MensajeContacto = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  enviando: boolean = false;
  mensajeExito: boolean = false;
  mensajeError: boolean = false;

  errores:string[] = [];

  constructor(private contactoService: ContactoService) { }

  onSubmit() {
    // Hacemos la comprobación manual
    if (!this.validarCampos()) {
      return;
    }


    this.enviando = true;
    this.mensajeError = false;
    this.errores = [];

    this.contactoService.enviarMensaje(this.datosFormulario).subscribe({
      next: (res) => {
        this.enviando = false;
        this.mensajeExito = true;

        // Limpiamos el formulario y el error
        this.datosFormulario = { nombre: '', email: '', asunto: '', mensaje: '' };

        setTimeout(() => this.mensajeExito = false, 5000);
      },
      error: (err) => {
        console.error(err);
        this.enviando = false;
        this.mensajeError = true;
        this.errores.push('Hubo un error de conexión con el servidor.');
      }
    });
  }

  // --- FUNCIÓN DE VALIDACIÓN ---
  validarCampos(): boolean {
    this.errores = [];

    if (!this.datosFormulario.nombre.trim()) {
      this.errores.push('Por favor, escribe tu nombre.');
      return false;
    }
    else if (!this.datosFormulario.email.trim()) {
      this.errores.push('El email es obligatorio para poder responderte.');
      return false;
    }

    else if (!this.datosFormulario.email.includes('@')) {
      this.errores.push('Por favor, escribe un email válido.');
      return false;
    }
    else if (!this.datosFormulario.asunto) {
      this.errores.push('Debes seleccionar un motivo para el mensaje.');
      return false;
    }
    else if (!this.datosFormulario.mensaje.trim()) {
      this.errores.push('El mensaje no puede estar vacío.');
      return false;
    }

    return true;
  }


}
