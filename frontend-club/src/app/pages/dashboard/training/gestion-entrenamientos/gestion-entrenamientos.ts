import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Entrenamiento } from '../../../../interfaces/entrenamientosInterface';
import { AuthService } from '../../../../services/authService';
import { EntrenamientosService } from '../../../../services/entrenamientosService';

@Component({
  selector: 'app-gestion-entrenamientos',
  standalone: false,
  templateUrl: './gestion-entrenamientos.html',
  styleUrl: './gestion-entrenamientos.css',
})
export class GestionEntrenamientos implements OnInit {

  misEntrenamientos: Entrenamiento[] = [];
  cargando: boolean = true;
  usuarioId: number = 0;
  usuarioRol: string = '';
  entrenamientoSeleccionadoObj?: Entrenamiento = undefined;

  // --- VARIABLES DEL FORMULARIO ---
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  entrenamientoIdAEditar: number | null = null;

  nuevaClase = {
    titulo: '',
    fecha_hora: '',
    ubicacion: '',
    descripcion: ''
  };

  // --- VARIABLES DEL MODAL DE ASISTENCIA ---
  mostrarModalAsistentes: boolean = false;
  cargandoAsistentes: boolean = false;
  atletasAsistentes: any[] = [];
  entrenamientoSeleccionado: string = '';

  constructor(
    private entrenamientosService: EntrenamientosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.usuario) {
      this.usuarioId = this.authService.usuario.id;
      this.usuarioRol = this.authService.usuario.rol;
      this.cargarMisClases();
    }
  }

  cargarMisClases() {
    this.cargando = true;
    this.entrenamientosService.getEntrenamientos().subscribe({
      next: (data: Entrenamiento[]) => {

        // --- LA MAGIA DEL ROL ---
        if (this.usuarioRol === 'admin') {
          // El admin ve el tablón completo de todos los entrenadores
          this.misEntrenamientos = data;
        } else {
          // Un entrenador normal solo ve los que ha creado él
          this.misEntrenamientos = data.filter(e => e.entrenador_id === this.usuarioId);
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar las clases', 'error');
      }
    });
  }

  // ==========================================
  // LÓGICA DEL FORMULARIO (CREAR Y EDITAR)
  // ==========================================

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.nuevaClase = { titulo: '', fecha_hora: '', ubicacion: '', descripcion: '' };
    this.modoEdicion = false;
    this.entrenamientoIdAEditar = null;
  }

  abrirEdicion(entreno: Entrenamiento) {
    // Formateamos la fecha "YYYY-MM-DD HH:mm:ss" a "YYYY-MM-DDThh:mm" para el input HTML
    const fechaInputFormat = entreno.fecha_hora.replace(' ', 'T').substring(0, 16);

    this.nuevaClase = {
      titulo: entreno.titulo,
      fecha_hora: fechaInputFormat,
      ubicacion: entreno.ubicacion,
      descripcion: entreno.descripcion || ''
    };

    this.modoEdicion = true;
    this.entrenamientoIdAEditar = entreno.id;
    this.mostrarFormulario = true;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  guardarClase() {
    if (!this.validarFormulario()) {
      return;
    }

    // Si estamos editando, respetamos el entrenador original (ideal para cuando el Admin edita clases ajenas).
    // Si estamos creando una nueva, se asigna al usuario que está logueado.
    const entrenadorIdFinal = this.modoEdicion && this.entrenamientoSeleccionadoObj
                              ? this.entrenamientoSeleccionadoObj.entrenador_id
                              : this.usuarioId;

    const datosEnvio = { ...this.nuevaClase, entrenador_id: entrenadorIdFinal };

    if (this.modoEdicion) {
      this.actualizarClase(datosEnvio);
    } else {
      this.crearClase(datosEnvio);
    }
  }

  validarFormulario(): boolean {
    if (!this.nuevaClase.titulo || !this.nuevaClase.fecha_hora || !this.nuevaClase.ubicacion) {
      Swal.fire('Atención', 'Título, fecha/hora y ubicación son obligatorios', 'warning');
      return false;
    }

    const fechaElegida = new Date(this.nuevaClase.fecha_hora);
    const fechaActual = new Date();

    if (fechaElegida < fechaActual) {
      Swal.fire('Atención', 'No puedes programar entrenamientos en el pasado', 'warning');
      return false;
    }

    const tiempoNuevo = fechaElegida.getTime();
    const existeSolapamiento = this.misEntrenamientos.some(entreno => {
      const tiempoExistente = new Date(entreno.fecha_hora).getTime();
      if (this.modoEdicion && entreno.id === this.entrenamientoIdAEditar) {
        return false;
      }
      return tiempoNuevo === tiempoExistente;
    });

    if (existeSolapamiento) {
      Swal.fire('Conflicto de horario', 'Ya tienes una sesión programada exactamente en esa misma fecha y hora.', 'warning');
      return false;
    }

    return true;
  }

  crearClase(datosEnvio: any) {
    this.entrenamientosService.crearEntrenamiento(datosEnvio).subscribe({
      next: () => {
        Swal.fire('¡Creada!', 'La sesión de entrenamiento ha sido publicada.', 'success');
        this.finalizarOperacion();
      },
      error: (err) => Swal.fire('Error', 'No se pudo crear la sesión', 'error')
    });
  }

  actualizarClase(datosEnvio: any) {
    if (!this.entrenamientoIdAEditar) return;

    this.entrenamientosService.actualizarEntrenamiento(this.entrenamientoIdAEditar, datosEnvio).subscribe({
      next: () => {
        Swal.fire('¡Actualizada!', 'La sesión ha sido modificada.', 'success');
        this.finalizarOperacion();
      },
      error: (err) => Swal.fire('Error', err.error?.message || 'No se pudo actualizar', 'error')
    });
  }

  finalizarOperacion() {
    this.limpiarFormulario();
    this.mostrarFormulario = false;
    this.cargarMisClases();
  }

  borrarClase(id: number) {
    Swal.fire({
      title: '¿Cancelar esta clase?',
      text: "Los atletas inscritos serán desapuntados automáticamente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, cancelar clase',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entrenamientosService.borrarEntrenamiento(id).subscribe({
          next: () => {
            Swal.fire('Cancelada', 'El entrenamiento ha sido eliminado.', 'success');
            this.cargarMisClases();
          },
          error: (err) => Swal.fire('Error', 'No se pudo borrar la clase', 'error')
        });
      }
    });
  }

  // ==========================================
  // GESTIÓN DE LA LISTA DE ASISTENCIA (MODAL)
  // ==========================================

  abrirModalAsistentes(entreno: any) {
    this.entrenamientoSeleccionadoObj = entreno;
    this.mostrarModalAsistentes = true;
    this.cargandoAsistentes = true;

    this.entrenamientosService.getAsistentes(entreno.id).subscribe({
      next: (data) => {
        this.atletasAsistentes = data;
        this.cargandoAsistentes = false;
      },
      error: (err) => {
        console.error(err);
        this.cargandoAsistentes = false;
        Swal.fire('Error', 'No se pudo cargar la lista', 'error');
      }
    });
  }

  cerrarModalAsistentes() {
    this.mostrarModalAsistentes = false;
    this.atletasAsistentes = [];
  }

  toggleAsistencia(atleta: any) {
    const nuevoEstado = atleta.asistencia == 1 ? 0 : 1;
    const idInscripcion = atleta.id;

    this.entrenamientosService.pasarLista(idInscripcion, nuevoEstado).subscribe({
      next: (res) => {
        atleta.asistencia = nuevoEstado;
        Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 })
            .fire({ icon: 'success', title: 'Guardado' });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar la asistencia', 'error');
      }
    });
  }

  entrenamientoPasado(fechaHora: string): boolean {
    const fechaEntreno = new Date(fechaHora);
    const ahora = new Date();
    return fechaEntreno < ahora;
  }

  // ==========================================
  // ESTADÍSTICAS EN TIEMPO REAL
  // ==========================================

  get totalInscritos(): number {
    return this.atletasAsistentes.length;
  }

  get totalAsistentes(): number {
    return this.atletasAsistentes.filter(a => a.asistencia == 1).length;
  }

  get totalFaltas(): number {
    return this.totalInscritos - this.totalAsistentes;
  }

  get porcentajeAsistencia(): number {
    if (this.totalInscritos === 0) return 0;
    return Math.round((this.totalAsistentes / this.totalInscritos) * 100);
  }
}
