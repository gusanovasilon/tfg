import { Component } from '@angular/core';
import { ConversacionAdmin, Mensaje } from '../../../../interfaces/mensajesInterface';
import { MensajesService } from '../../../../services/mensajesService';
import { AuthService } from '../../../../services/authService';
import { UsuariosService } from '../../../../services/usuariosService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensajes',
  standalone: false,
  templateUrl: './mensajes.html',
  styleUrls: ['./mensajes.css']
})
export class Mensajes {
  usuarioLogueado: any = null;
  esAdmin: boolean = false;

  // DATOS DE MENSAJERÍA
  misMensajes: Mensaje[] = [];
  listaConversaciones: ConversacionAdmin[] = [];
  chatDetalle: Mensaje[] = [];

  // DATOS PARA NUEVO MENSAJE
  listaUsuarios: any[] = [];
  nuevoMensaje: Mensaje = {
    remitente_id: 0,
    destinatario_id: 0,
    asunto: '',
    cuerpo: '',
    tipo: 'privado'
  };

  // ESTADOS DE LA VISTA
  cargando: boolean = true;
  vistaActual: 'INBOX' | 'ADMIN_LISTA' | 'CHAT_DETALLE' = 'INBOX';
  mostrarModalNuevo: boolean = false;

  constructor(
    private mensajesService: MensajesService,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    // Verificamos que authService tenga datos antes de asignar
    if (this.authService.usuario) {
      this.usuarioLogueado = this.authService.usuario;
      this.esAdmin = this.usuarioLogueado.rol === 'admin';
      this.nuevoMensaje.remitente_id = this.usuarioLogueado.id;
      console.log(this.usuarioLogueado);


      this.cargarDatosIniciales();
      this.cargarListaUsuarios();
    } else {
      console.error('No hay usuario logueado en AuthService');
      this.cargando = false;
    }
  }

  cargarDatosIniciales() {
    this.cargando = true;

    if (this.esAdmin) {
      this.vistaActual = 'ADMIN_LISTA';
      this.mensajesService.getConversacionesAdmin().subscribe({
        next: (data) => {
          this.listaConversaciones = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
        }
      });
    } else {
      this.vistaActual = 'INBOX';
      this.mensajesService.getMisMensajes(this.usuarioLogueado.id).subscribe({
        next: (data) => {
          console.log('--- DATOS RECIBIDOS DEL BACKEND ---');
          console.log(data);
          this.misMensajes = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('--- ERROR DEL BACKEND ---');
          console.error(err);
          this.cargando = false;
        }
      });

    }
  }

  cargarListaUsuarios() {
    this.usuariosService.getUsuarios().subscribe(users => {
      this.listaUsuarios = users.filter((u: any) => u.id !== this.usuarioLogueado.id);
    });
  }

  // --- FUNCIONES ADMIN ---

  verChatCompleto(u1: number, u2: number) {
    this.cargando = true;
    this.mensajesService.getChatCompleto(u1, u2).subscribe(chat => {
      this.chatDetalle = chat;
      this.vistaActual = 'CHAT_DETALLE';
      this.cargando = false;
    });
  }

  borrarConversacion(u1: number, u2: number) {
    Swal.fire({
      title: '¿Borrar conversación?',
      text: "Se eliminarán todos los mensajes. No se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar todo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajesService.borrarConversacionEntera(u1, u2).subscribe(() => {
          Swal.fire('Borrado', 'Conversación eliminada', 'success');
          this.volverALista();
        });
      }
    });
  }

  // --- FUNCIONES COMUNES ---

  abrirModalNuevo() {
    this.mostrarModalNuevo = true;
  }

  cerrarModal() {
    this.mostrarModalNuevo = false;
    this.nuevoMensaje.asunto = '';
    this.nuevoMensaje.cuerpo = '';
    this.nuevoMensaje.destinatario_id = 0;
  }

  enviar() {
    if (this.nuevoMensaje.destinatario_id == 0 && !this.esAdmin) {
      Swal.fire('Error', 'Solo el admin puede enviar anuncios globales', 'error');
      return;
    }

    if (!this.nuevoMensaje.cuerpo || (this.nuevoMensaje.destinatario_id !== 0 && !this.nuevoMensaje.destinatario_id)) {
      Swal.fire('Faltan datos', 'Elige destinatario y escribe mensaje', 'warning');
      return;
    }

    this.mensajesService.enviarMensaje(this.nuevoMensaje).subscribe({
      next: () => {
        Swal.fire('Enviado', 'Mensaje enviado', 'success');
        this.cerrarModal();
        this.cargarDatosIniciales();
      },
      error: () => Swal.fire('Error', 'No se pudo enviar', 'error')
    });
  }

  volverALista() {
    this.chatDetalle = [];
    this.vistaActual = this.esAdmin ? 'ADMIN_LISTA' : 'INBOX';
    this.cargarDatosIniciales();
  }
}
