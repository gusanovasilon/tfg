import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/noticiasService';
import { Noticia } from '../../interfaces/noticiasInterface';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.html',
  standalone: false,
  styleUrls: ['./noticias.css']
})
export class NoticiasComponent implements OnInit {

  listaNoticias: Noticia[] = [];
  cargando: boolean = true;


  constructor(private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.obtenerNoticias();
  }

  obtenerNoticias() {
    this.noticiasService.getNoticias().subscribe({
      next: (data:Noticia[]) => {
        this.listaNoticias = data;
        this.cargando = false;
      },
      error: (e) => {
        console.error('Error al cargar noticias:', e);
        this.cargando = false;
    }
    });
  }
}
