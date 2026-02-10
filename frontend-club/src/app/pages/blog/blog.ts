import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/noticiasService';
import { Noticia } from '../../interfaces/noticiasInterface';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  standalone:false,
  styleUrls: ['./blog.css']
})
export class Blog implements OnInit {

  // 1. Array MAESTRO (Todas las noticias de la API)
  listaNoticias: Noticia[] = [];

  // 2. Array VISIBLE (Lo que pintamos en el HTML)
  noticiasToShow: Noticia[] = [];

  cargando: boolean = true;

  // Variables para la PAGINACIÓN y FILTRO
  paginaActual: number = 1;
  itemsPorPagina: number = 6;
  terminoBusqueda: string = '';
  totalResultadosFiltrados: number = 0; // Para saber cuándo deshabilitar el botón "Siguiente"

  constructor(private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.obtenerNoticias();
  }

  obtenerNoticias() {
    this.noticiasService.getNoticias().subscribe({
      next: (data: Noticia[]) => {
        this.listaNoticias = data;
        this.cargando = false;
        // Al cargar, inicializamos la vista con todas las noticias (página 1)
        this.actualizarVista();
      },
      error: (e) => {
        console.error('Error al cargar noticias:', e);
        this.cargando = false;
      }
    });
  }

  // --- FUNCIÓN PRINCIPAL: SE EJECUTA AL ESCRIBIR O CAMBIAR PÁGINA ---
  actualizarVista() {
    // PASO 1: FILTRAR
    // Creamos una copia temporal filtrada
    // Usamos toLowerCase() para que le da igual mayúsculas que minúsculas
    const noticiasFiltradas = this.listaNoticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );

    this.totalResultadosFiltrados = noticiasFiltradas.length;

    // PASO 2: PAGINAR
    // Calculamos dónde cortar el array
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    // Cortamos el array filtrado y se lo damos a la variable que ve el usuario
    this.noticiasToShow = noticiasFiltradas.slice(inicio, fin);
  }

  // --- EVENTOS DEL HTML ---

  // Se llama cada vez que escribes en el input
  onSearch(termino: string) {
    this.terminoBusqueda = termino;
    this.paginaActual = 1; // IMPORTANTE: Al buscar, volvemos siempre a la página 1
    this.actualizarVista();
  }

  // Se llama al pulsar Anterior/Siguiente
  cambiarPagina(direccion: number) {
    this.paginaActual += direccion;
    this.actualizarVista();
    // Scroll suave hacia arriba para que el usuario vea los resultados nuevos
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Calcula el número total de páginas (para saber si bloquear el botón Siguiente)
  get totalPaginas(): number {
    return Math.ceil(this.totalResultadosFiltrados / this.itemsPorPagina);
  }
}
