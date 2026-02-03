import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.html',
  standalone:false,
  styleUrls: ['./noticias.css']
})
export class NoticiasComponent implements OnInit {

  listaNoticias: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getNoticias().subscribe({
      next: (data) => {
        console.log('Noticias recibidas:', data);
        this.listaNoticias = data;
      },
      error: (err) => {
        console.error('Error al conectar:', err);
      }
    });
  }
}
