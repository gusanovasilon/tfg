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

  
  constructor(private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias() {
    this.noticiasService.getNoticias().subscribe(data => {
      this.listaNoticias = data;
    });
  }
}
