import { Component, ElementRef, ViewChild } from '@angular/core';
import { MensajesService } from '../../../../services/mensajesService';
import { AuthService } from '../../../../services/authService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminmensajes',
  standalone: false,
  templateUrl: './adminmensajes.html',
  styleUrl: './adminmensajes.css',
})
export class Adminmensajes {
@ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  // ESTADOS DE LA VISTA
  vistaActiva: 'tabla' | 'chat' = 'tabla';
  cargando: boolean = true;

  // DATOS
  listaConversaciones: any[] = [];
  chatActivo: any = null;
  chatDetalle: any[] = [];
  adminId: number = 0;

  constructor(
    private mensajesService: MensajesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.usuario) {
      this.adminId = this.authService.usuario.id;
      this.cargarTodasLasConversaciones();
    }
  }

  // --- CARGA DE DATOS ---
  cargarTodasLasConversaciones() {
    this.cargando = true;
    // Como el CI4 sabe que somos Admin por el ID, nos devolverá getTodasConversacionesAdmin()
    this.mensajesService.getMisConversaciones(this.adminId).subscribe({
      next: (data) => {
        this.listaConversaciones = data;
        this.cargando = false;
        console.log(data);

      },
      error: (err) => {
        console.error('Error cargando auditoría:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar las comunicaciones', 'error');
      }
    });
  }


  // --- NAVEGACIÓN Y AUDITORÍA ---
  abrirChatAdmin(chat: any) {
    this.chatActivo = chat;
    this.vistaActiva = 'chat';
    this.cargando = true;
    console.log("chat:"+ chat);
    console.log("chat-id:"+ chat.id);

    this.mensajesService.getMensajesDeConversacion(chat.conversacion_id).subscribe({
      next: (mensajes) => {
        console.log("chat:"+ chat);
        console.log("chat-id:"+ chat.id);

        this.chatDetalle = mensajes;
        this.cargando = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  volverTabla() {
    this.vistaActiva = 'tabla';
    this.chatActivo = null;
    this.chatDetalle = [];
    this.cargarTodasLasConversaciones(); // Refrescar por si ha borrado algo
  }

  eliminarConversacion(chatId: number) {
    Swal.fire({
      title: '¿Eliminar conversación?',
      text: "Esta acción borrará los mensajes Y eliminará el chat del sistema para ambos usuarios. Es irreversible.",
      icon: 'error', // Icono rojo para dar más respeto
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí,eliminar conversación'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajesService.eliminarSalaCompleta(chatId).subscribe({
          next: () => {
            Swal.fire('Chat Eliminado', 'El chat ha desaparecido del sistema.', 'success');

            if (this.vistaActiva === 'chat') {
              this.volverTabla(); // Lo sacamos del chat porque ya no existe
            } else {
              this.cargarTodasLasConversaciones(); // Refrescamos la tabla
            }
          },
          error: () => Swal.fire('Error', 'No se pudo destruir la sala', 'error')
        });
      }
    });
  }

  // Utilidad para el scroll del chat espía
  scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.myScrollContainer) {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
      }, 100);
    } catch (err) { }
  }

  // --- AVISO GLOBAL MASIVO ---
  lanzarAvisoGlobal() {
    Swal.fire({
      title: '📣 Enviar Aviso Global',
      input: 'textarea',
      inputLabel: 'Escribe el comunicado para el Club',
      inputPlaceholder: 'Ej: El gimnasio permanecerá cerrado mañana por obras de mantenimiento...',
      inputAttributes: {
        'aria-label': 'Escribe tu mensaje aquí',
        'rows': '4'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar a todos <i class="bi bi-send-fill ms-1"></i>',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f59e0b', // Naranja corporativo
      customClass: {
        input: 'form-control'
      }
    }).then((result) => {
      // Si el admin escribió algo y le dio a enviar
      if (result.isConfirmed && result.value?.trim()) {

        // Ponemos un loader bonito mientras el servidor reparte los mensajes
        Swal.fire({
          title: 'Enviando...',
          text: 'Repartiendo el aviso a todos los casilleros',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.mensajesService.enviarAvisoGlobal(this.adminId, result.value).subscribe({
          next: (res) => {
            Swal.fire('¡Difusión completada!', res.message, 'success');
            // Refrescamos la tabla de auditoría para ver los chats actualizados
            if (this.vistaActiva === 'tabla') {
              this.cargarTodasLasConversaciones();
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Hubo un problema al enviar el aviso', 'error');
          }
        });
      } else if (result.isConfirmed) {
        // Si le dio a enviar pero el texto estaba vacío
        Swal.fire('Aviso', 'El mensaje no puede estar vacío', 'warning');
      }
    });
  }
}
