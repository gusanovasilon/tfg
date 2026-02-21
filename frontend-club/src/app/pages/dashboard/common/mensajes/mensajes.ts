import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Mensaje, Conversacion } from '../../../../interfaces/mensajesInterface';
import { MensajesService } from '../../../../services/mensajesService';
import { AuthService } from '../../../../services/authService';
import { UsuariosService } from '../../../../services/usuariosService';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../interfaces/authInterface';

@Component({
  selector: 'app-mensajes',
  standalone: false,
  templateUrl: './mensajes.html',
  styleUrls: ['./mensajes.css']
})
export class Mensajes implements OnInit {

  // Referencia para el scroll automático
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  usuarioLogueado: any = null;
  esAdmin: boolean = false;

  // DATOS
  listaConversaciones: Conversacion[] = [];
  chatDetalle: Mensaje[] = [];
  chatActivo: Conversacion | null = null;

  // MODAL NUEVO CHAT
  listaUsuarios: Usuario[] = [];
  mostrarModalNuevo: boolean = false;

  // MODELO PARA ENVÍO
  nuevoMensaje: Mensaje = {
    remitente_id: 0,
    destinatario_id: 0,
    cuerpo: '',
    tipo: 'privado'
  };

  cargando: boolean = true;

  constructor(
    private mensajesService: MensajesService,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    if (this.authService.usuario) {
      this.usuarioLogueado = this.authService.usuario;
      this.esAdmin = this.usuarioLogueado.rol === 'admin';
      this.nuevoMensaje.remitente_id = this.usuarioLogueado.id;

      this.cargarDatosIniciales();
      this.cargarListaUsuarios();
    } else {
      this.cargando = false;
    }
  }

  // --- CARGA DE DATOS ---

  cargarDatosIniciales() {
    this.cargando = true;
    this.mensajesService.getMisConversaciones(this.usuarioLogueado.id).subscribe({
      next: (data) => {
        this.listaConversaciones = data;
        console.log(data);

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando chats:', err);
        this.cargando = false;
      }
    });
  }

  cargarListaUsuarios() {
    this.usuariosService.getUsuarios().subscribe(users => {
      // Filtramos para no mostrarnos a nosotros mismos
      this.listaUsuarios = users.filter((u: any) => u.id !== this.usuarioLogueado.id && u.rol !== 'escritor' && u.rol !== 'admin');
    });
  }

  // --- GESTIÓN DEL CHAT ---

  abrirChat(conversacion: Conversacion) {
    this.chatActivo = conversacion;
    this.cargando = true;

    this.mensajesService.getMensajesDeConversacion(conversacion.conversacion_id).subscribe({
      next: (mensajes) => {
        this.chatDetalle = mensajes;
        this.cargando = false;
        this.scrollToBottom(); // Bajar el scroll al abrir
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  borrarConversacion(chatId: number, event: Event) {
    event.stopPropagation();

    Swal.fire({
      title: '¿Borrar chat completo?',
      text: "Se eliminarán todos los mensajes de esta conversación.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.chatDetalle.length > 0){
          this.mensajesService.borrarConversacion(chatId).subscribe(() => {
          this.chatActivo = null; // Cerramos el chat si estaba abierto
          this.cargarDatosIniciales(); // Recargamos la lista

        });

        }else {
          Swal.fire('Conversación vacía', 'No hay mensajes que eliminar', 'error');
        }

      }
    });
  }

  // --- ENVÍO DE MENSAJES ---

  // 1. Enviar desde la barra del chat (Derecha)
  enviarDesdeChat() {
    if (!this.chatActivo || !this.nuevoMensaje.cuerpo.trim()) return;

    const mensajeAEnviar: Mensaje = {
      remitente_id: this.usuarioLogueado.id,
      destinatario_id: (this.chatActivo as any).id_otro,
      conversacion_id: this.chatActivo.conversacion_id,
      cuerpo: this.nuevoMensaje.cuerpo,
      tipo: 'privado'
    };

    this.mensajesService.enviarMensaje(mensajeAEnviar).subscribe({
      next: () => {
        console.log(this.chatActivo?.conversacion_id);

        // Actualización optimista (Visual)
        mensajeAEnviar.fecha_envio = new Date().toISOString();
        this.chatDetalle.push(mensajeAEnviar);
        this.nuevoMensaje.cuerpo = '';
        this.scrollToBottom();
      },
      error: () => Swal.fire('Error', 'No se pudo enviar', 'error')
    });
  }

  // 2. Enviar desde el Modal "Nuevo Chat" (Izquierda)
  enviar() {
    if (this.nuevoMensaje.destinatario_id == 0 && !this.esAdmin) {
      Swal.fire('Error', 'Debes seleccionar un destinatario', 'error');
      return;
    }

    this.mensajesService.enviarMensaje(this.nuevoMensaje).subscribe({
      next: () => {
        console.log('Datos a enviar:', this.nuevoMensaje);
        if (this.nuevoMensaje.cuerpo === ""){
        Swal.fire('Enviado', 'Conversacion creada', 'success');
        }else {
        Swal.fire('Enviado', 'Mensaje enviado', 'success');
        }
        this.cerrarModal();
        this.cargarDatosIniciales();
      },

      error: () => Swal.fire('Error', 'No se pudo enviar', 'error')
    });
  }



  abrirModalNuevo() {
    this.mostrarModalNuevo = true;
  }

  cerrarModal() {
    this.mostrarModalNuevo = false;
    this.nuevoMensaje.cuerpo = '';
    this.nuevoMensaje.destinatario_id = 0;
  }

  // Baja el scroll al último mensaje
  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }, 100);
    } catch (err) { }
  }

  tieneChat (usuarioId: number):boolean{
    console.log((this.listaConversaciones));

    return this.listaConversaciones.some (chat => chat.id_otro == usuarioId);
  }
}
