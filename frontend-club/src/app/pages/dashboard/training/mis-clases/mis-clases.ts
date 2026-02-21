import { Component, OnInit } from '@angular/core';
import { EntrenamientosService } from '../../../../services/entrenamientosService';
import { AuthService } from '../../../../services/authService';
import { Entrenamiento } from '../../../../interfaces/entrenamientosInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-clases',
  standalone: false,
  templateUrl: './mis-clases.html',
  styleUrl: './mis-clases.css',
})
export class MisClases implements OnInit {
  entrenamientos: Entrenamiento[] = [];
  cargando: boolean = true;
  usuarioId: number = 0;

  // Nueva variable para controlar qué pestaña está activa
  filtroActual: 'todos' | 'apuntados' = 'todos';

  constructor(
    private entrenamientosService: EntrenamientosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.usuario) {
      this.usuarioId = this.authService.usuario.id;
      this.cargarEntrenamientos();
    }
  }

  cargarEntrenamientos() {
    this.cargando = true;
    this.entrenamientosService.getEntrenamientos(this.usuarioId).subscribe({
      next: (data) => {
        this.entrenamientos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar las clases:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los entrenamientos', 'error');
      }
    });
  }

  entrenamientoPasado(fechaHora: string): boolean {
    const fechaEntreno = new Date(fechaHora);
    const ahora = new Date();
    return fechaEntreno < ahora;
  }

  // ESTA ES LA MAGIA DEL FILTRO: Angular usará esta lista para pintar el HTML
  get entrenamientosFiltrados(): Entrenamiento[] {
    if (this.filtroActual === 'apuntados') {
      return this.entrenamientos.filter(e => e.apuntado === true);
    }
    return this.entrenamientos;
  }

  // Función para cambiar de pestaña al hacer clic
  cambiarFiltro(nuevoFiltro: 'todos' | 'apuntados') {
    this.filtroActual = nuevoFiltro;
  }

  toggleInscripcion(entrenamiento: Entrenamiento) {
    this.entrenamientosService.toggleInscripcion(this.usuarioId, entrenamiento.id).subscribe({
      next: (res) => {
        entrenamiento.apuntado = res.apuntado;

        const Toast = Swal.mixin({
          toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true
        });

        Toast.fire({ icon: res.apuntado ? 'success' : 'info', title: res.message });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Hubo un problema con la inscripción', 'error');
      }
    });
  }
}

