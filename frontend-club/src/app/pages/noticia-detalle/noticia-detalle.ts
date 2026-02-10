import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Para leer la URL
import { NoticiasService } from '../../services/noticiasService';
import { Noticia } from '../../interfaces/noticiasInterface';

@Component({
  selector: 'app-noticia-detalle',
  templateUrl: './noticia-detalle.html',
  standalone:false,
  styleUrls: ['./noticia-detalle.css']
})
export class NoticiaDetalle implements OnInit {

  noticia: Noticia | null = null;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,   // Para saber qué ID nos piden
    private router: Router,          // Para redirigir si hay error
    private noticiasService: NoticiasService
  ) { }

  ngOnInit(): void {
    // 1. Capturamos el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');
    ;

    // 2. Si hay ID, llamamos al servicio
    if (id) {
      this.noticiasService.getNoticia(parseInt(id)).subscribe({
        next: (data) => {
          this.noticia = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar la noticia', err);
          this.cargando = false;
          // Opcional: Si no existe, volver al blog
          this.router.navigate(['/blog']);
        }
      });
    }
  }
}
