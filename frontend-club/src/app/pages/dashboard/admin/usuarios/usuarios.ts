import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../../services/usuariosService';
import { FichaService } from '../../../../services/fichaService';
// 1. IMPORTAMOS LA INTERFAZ
import { Ficha } from '../../../../interfaces/fichaInterface';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { Usuario } from '../../../../interfaces/authInterface';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {

  usuarios: any[] = [];
  usuariosFiltrados: Usuario[] = [];
  textoBusqueda: string = '';
  cargando: boolean = true;
  usuarioSeleccionado!: Usuario;
  mostrarModal: boolean = false;
  datosFicha: Ficha = {};
  paginaActual: number = 1;
  itemsPorPagina: number = 5;


  previewUrl: string | ArrayBuffer | null = null;
  archivoSeleccionado: File | null = null;
  constructor(
    private usuariosService: UsuariosService,
    private fichaService: FichaService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (resp: any) => {
        this.usuarios = resp.usuarios || resp;
        this.usuariosFiltrados = this.usuarios;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  filtrar() {
    this.paginaActual = 1;
    if (!this.textoBusqueda) {
      this.usuariosFiltrados = this.usuarios;
    } else {
      const texto = this.textoBusqueda.toLowerCase();
      this.usuariosFiltrados = this.usuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto) ||
        u.email.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto)
      );
    }
  }
  get usuariosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }
  get totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
  }
  get paginasArray(): number[] {
    return Array(this.totalPaginas).fill(0).map((x, i) => i + 1);
  }
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  borrarUsuario(usuario: any) {
    if (usuario.rol === 'admin') {
      Swal.fire('Acción denegada', 'No puedes borrar a un administrador', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar a ${usuario.nombre}. No se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(usuario.id).subscribe({
          next: () => {
            Swal.fire('Borrado', 'Usuario eliminado', 'success');
            this.cargarUsuarios();
          },
          error: () => Swal.fire('Error', 'No se pudo borrar', 'error')
        });
      }
    });
  }

  // --- ABRIR MODAL Y CARGAR FICHA ---
  abrirEdicion(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };
    this.datosFicha = {};

    // 1. Reseteamos la foto
    this.previewUrl = null;
    this.archivoSeleccionado = null;

    // Solo buscamos ficha y foto si es Atleta o Entrenador
    // (NOTA: Si quieres escritores, necesitarías backend para ellos.
    //  Por ahora lo dejamos preparado visualmente).
    if (usuario.id && (usuario.rol === 'atleta' || usuario.rol === 'entrenador')) {

      this.fichaService.getFicha(usuario.id).subscribe({
        next: (resp: any) => {
          if (resp.ficha) {
            this.datosFicha = resp.ficha;

            // 2. Si tiene foto, construimos la URL completa
            if (resp.ficha.foto_url) {
              const carpeta = usuario.rol === 'atleta' ? 'atletas/' : 'entrenadores/';
              this.previewUrl = environment.imgBaseUrl + carpeta + resp.ficha.foto_url;
            }
          }
        },
        error: () => console.log('Usuario sin ficha')
      });
    }

    this.mostrarModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // --- GUARDAR TODO ---
  guardarCambiosUsuario() {

    // 1. VALIDACIONES PREVIAS
    const patron = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    // A) Campos obligatorios SIEMPRE (Crear y Editar)
    if (!this.usuarioSeleccionado.nombre) {
      Swal.fire('Error', 'El nombre no puede estar vacío', 'error');
      return;
    }
    if (!this.usuarioSeleccionado.apellidos) {
      Swal.fire('Error', 'Los apellidos no pueden estar vacíos', 'error');
      return;
    }
    if (!this.usuarioSeleccionado.email) {
      Swal.fire('Error', 'El email no puede estar vacío', 'error');
      return;
    }

    // B) Campos obligatorios SOLO AL CREAR (Contraseña)
    if (!this.usuarioSeleccionado.id) {
      if (!this.usuarioSeleccionado.password || !patron.test(this.usuarioSeleccionado.password)) {
        Swal.fire('Error', 'La contraseña es obligatoria y debe tener al menos 6 caracteres, una letra y un número.', 'error');
        return;
      }
    }

    // === CASO 1: EDITAR USUARIO EXISTENTE ===
    if (this.usuarioSeleccionado.id) {
      this.usuariosService.updateUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado)
        .subscribe({
          next: () => {
            // Si es atleta/entrenador, guardamos también la ficha
            if (this.esRolDeportivo(this.usuarioSeleccionado.rol)) {
              this.guardarFichaDelUsuario(this.usuarioSeleccionado.id);
            } else {
              this.cerrarModalExito();
            }
          },
          error: () => Swal.fire('Error', 'No se pudo editar el usuario', 'error')
        });

    }
    // === CASO 2: CREAR NUEVO USUARIO ===
    else {
      if (!this.usuarioSeleccionado.nombre) {
      Swal.fire('Error', 'El nombre no puede estar vacío', 'error');
      return;
    }
    if (!this.usuarioSeleccionado.apellidos) {
      Swal.fire('Error', 'Los apellidos no pueden estar vacíos', 'error');
      return;
    }
    if (!this.usuarioSeleccionado.email) {
      Swal.fire('Error', 'El email no puede estar vacío', 'error');
      return;
    }
    if (!this.usuarioSeleccionado.rol) {
      Swal.fire('Error', 'El rol no puede estar vacío', 'error');
      return;
    }
    this.usuariosService.createUsuario(this.usuarioSeleccionado).subscribe({ // Asegúrate de llamar a crearUsuario (o createUsuario según tu servicio)

        next: (resp: any) => {
          // Recuperamos el ID que nos devuelve el Backend (Usuarios.php)
          const nuevoId = resp.id;

          if (this.esRolDeportivo(this.usuarioSeleccionado.rol)) {
            // AHORA sí llamamos a crear la ficha con el ID correcto
            this.guardarFichaDelUsuario(nuevoId);
          } else {
            this.cerrarModalExito();
          }
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear. Es posible que el email ya exista.', 'error');
        }
      });
    }
  }
  // Pequeña ayuda para limpiar el código
  esRolDeportivo(rol: string): boolean {
    return rol === 'atleta' || rol === 'entrenador';
  }

  guardarFichaDelUsuario(idUsuario: number) {
    const formData = new FormData();

    // Campos de texto
    if (this.usuarioSeleccionado.rol === 'atleta') {
      formData.append('peso', this.datosFicha.peso?.toString() || '');
      formData.append('altura', this.datosFicha.altura?.toString() || '');
      formData.append('categoria', this.datosFicha.categoria || '');
    } else {
      formData.append('especialidad', this.datosFicha.especialidad || '');
      formData.append('biografia', this.datosFicha.biografia || '');
    }

    // 3. ¡IMPORTANTE! Adjuntar la foto si se seleccionó una nueva
    if (this.archivoSeleccionado) {
      formData.append('foto', this.archivoSeleccionado);
    }

    this.fichaService.updateFicha(idUsuario, formData).subscribe({
      next: () => this.cerrarModalExito(),
      error: () => Swal.fire('Aviso', 'Error al guardar la ficha técnica', 'warning')
    });
  }

  cerrarModalExito() {
    Swal.fire('Actualizado', 'Datos guardados correctamente', 'success');
    this.mostrarModal = false;
    this.cargarUsuarios();
  }
}
