import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../../../services/contactoService';
import { MensajeContacto } from '../../../../interfaces/mensajeContactoInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensajes-contacto',
  standalone: false,
  templateUrl: './mensajes-contacto.html',
  styleUrls: ['./mensajes-contacto.css']
})
export class MensajesContacto implements OnInit {

  mensajes: MensajeContacto[] = [];
  cargando: boolean = true;

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.cargarMensajes();
  }

  cargarMensajes() {
    this.cargando = true;
    this.contactoService.getMensajes().subscribe({
      next: (data) => {
        console.log(data);

        this.mensajes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  borrar(id: number | undefined) {
    if (!id) return;

    // 1. Lanzamos la alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás recuperar este mensaje después.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Rojo para indicar peligro
      cancelButtonColor: '#3085d6', // Azul para cancelar
      confirmButtonText: 'Sí, borrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      // 2. Si el usuario pulsa "Sí, borrarlo"
      if (result.isConfirmed) {

        // Llamamos al servicio
        this.contactoService.borrarMensaje(id).subscribe({
          next: () => {
            // Actualizamos la lista visualmente
            this.mensajes = this.mensajes.filter(m => m.id !== id);

            // 3. Alerta de Éxito
            Swal.fire(
              '¡Borrado!',
              'El mensaje ha sido eliminado.',
              'success'
            );
          },
          error: (err) => {
            // Alerta de Error si falla el servidor
            Swal.fire(
              'Error',
              'Hubo un problema al borrar el mensaje.',
              'error'
            );
          }
        });
      }
    });
  }
}
