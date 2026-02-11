import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
galeriaActiva: string = '';

  mostrarGaleria(tipo: string) {
    this.galeriaActiva = tipo;
    setTimeout(() => {
      const elemento = document.getElementById('zona-dinamica');
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}
