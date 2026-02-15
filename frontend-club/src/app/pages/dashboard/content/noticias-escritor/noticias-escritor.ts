import { environment } from './../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../../../services/noticiasService';
import { AuthService } from '../../../../services/authService'; // Para saber el ID del autor
import Swal from 'sweetalert2';
import { Noticia } from '../../../../interfaces/noticiasInterface';

@Component({
  selector: 'app-noticias-escritor',
  standalone:false,
  templateUrl: './noticias-escritor.html',
  styleUrls: ['./noticias-escritor.css']
})
export class NoticiasEscritor implements OnInit {
  noticiasFiltradas: Noticia[] = [];
  noticias: Noticia[] = [];
  cargando: boolean = true;
  urlImagenes = environment.imgBaseUrl + 'noticias/'; // Ruta base para mostrar fotos

  // Variables para el Modal y Formulario
  mostrarModal: boolean = false;
  esEdicion: boolean = false;

  // Datos del formulario
  idNoticiaActual: number | null = null;
  titulo: string = '';
  contenido: string = '';
  archivoSeleccionado: File | null = null;

  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  // Para previsualizar la imagen que acabamos de seleccionar
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private noticiasService: NoticiasService,
    private authService: AuthService // informacion de usuarios
  ) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias() {
    this.cargando = true;
    this.noticiasService.getNoticias().subscribe({
      next: (data) => {
        this.noticias = data;


        this.noticiasFiltradas = data;
        // -------------------------

        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  // --- GESTIÓN DEL MODAL ---

  abrirModalCrear() {
    this.esEdicion = false;
    this.limpiarFormulario();
    this.mostrarModal = true;
  }

  abrirModalEditar(noticia: any) {
    this.esEdicion = true;
    this.idNoticiaActual = noticia.id;
    this.titulo = noticia.titulo;
    this.contenido = noticia.contenido;

    // Si ya tiene imagen, mostramos la que tiene
    if (noticia.imagen_url) {
        this.previewUrl = this.urlImagenes + noticia.imagen_url;
    } else {
        this.previewUrl = null;
    }

    this.archivoSeleccionado = null; // Reseteamos el archivo nuevo
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.titulo = '';
    this.contenido = '';
    this.archivoSeleccionado = null;
    this.previewUrl = null;
    this.idNoticiaActual = null;
  }

  /* Paginacion */
  get noticiasPaginadas(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.noticiasFiltradas.slice(inicio, fin);
  }

  // Calcula el número total de páginas
  get totalPaginas(): number {
    return Math.ceil(this.noticiasFiltradas.length / this.itemsPorPagina);
  }

  // Crea un array de números [1, 2, 3...] para el HTML
  get paginasArray(): number[] {
    return Array(this.totalPaginas).fill(0).map((x, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  // --- GESTIÓN DE FICHEROS (Input File) ---

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.archivoSeleccionado = file;

      // Código extra para mostrar la previsualización antes de subirla
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // --- GUARDAR (Crear o Editar) ---

  guardar() {
    // 1. Validaciones básicas
    if (!this.titulo || !this.contenido) {
      Swal.fire('Error', 'Título y contenido son obligatorios', 'error');
      return;
    }

    // 2. Preparamos el FormData (Es como un sobre virtual para meter archivos)
    const formData = new FormData();
    formData.append('titulo', this.titulo);
    formData.append('contenido', this.contenido);

    // Añadimos el ID del autor (el usuario logueado)
    const usuarioLogueado = this.authService.usuario; // Asegúrate que tu authService tenga el usuario guardado
    if (usuarioLogueado) {
      console.log(usuarioLogueado)
        formData.append('autor_id', usuarioLogueado.id.toString());
    }

    // Si ha seleccionado una imagen nueva
    if (this.archivoSeleccionado) {
      formData.append('imagen', this.archivoSeleccionado);
    }

    // Enviamos al servidor
    if (this.esEdicion && this.idNoticiaActual) {
      // EDITAR
      this.noticiasService.editarNoticia(this.idNoticiaActual, formData).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Noticia editada correctamente', 'success');
          this.cerrarModal();
          this.cargarNoticias();
        },
        error: () => Swal.fire('Error', 'No se pudo editar', 'error')
      });
    } else {
      // CREAR
      this.noticiasService.crearNoticia(formData).subscribe({
        next: () => {
          Swal.fire('Creado', 'Noticia publicada correctamente', 'success');
          this.cerrarModal();
          this.cargarNoticias();
        },
        error: () => Swal.fire('Error', 'No se pudo crear', 'error')
      });
    }
  }

  borrar(id: number) {
    Swal.fire({
      title: '¿Borrar noticia?',
      text: "Se eliminará permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticiasService.borrarNoticia(id).subscribe(() => {
        // Actualizamos ambos arrays
        this.noticias = this.noticias.filter(n => n.id !== id);
        this.noticiasFiltradas = this.noticiasFiltradas.filter(n => n.id !== id); 

        // Si la página actual se queda vacía, retrocedemos
        if (this.noticiasPaginadas.length === 0 && this.paginaActual > 1) {
            this.paginaActual--;
        }

        Swal.fire('Borrado', 'La noticia ha sido eliminada', 'success');
    });
      }
    });
  }
}
