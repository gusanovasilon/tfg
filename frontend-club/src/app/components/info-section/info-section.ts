import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info-section',
  standalone: false,
  templateUrl: './info-section.html',
  styleUrl: './info-section.css',
})
export class InfoSection {
@Output() cambioGaleria = new EventEmitter<string>();

  seleccionarGaleria(tipo: string) {
    this.cambioGaleria.emit(tipo);
  }
}
