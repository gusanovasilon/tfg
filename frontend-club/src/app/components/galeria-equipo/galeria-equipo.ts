
import { Component, OnInit } from '@angular/core';
import { GaleriaService } from '../../services/galeriaService';
import { GaleriaItem } from '../../interfaces/galeriaInterface';

@Component({
  selector: 'app-galeria-equipo',
  standalone: false,
  templateUrl: './galeria-equipo.html',
  styleUrl: './galeria-equipo.css',
})
export class GaleriaEquipo implements OnInit {

  equipo: GaleriaItem[] = [];
  cargando: boolean = true;

  constructor(private galeriaService: GaleriaService) {}

  ngOnInit(): void {
    this.galeriaService.getGaleria().subscribe({
      next: (todasLasFotos) => {
        console.log('--- DATOS CRUDOS DE API:', todasLasFotos);

        this.equipo = todasLasFotos.filter(foto => foto.id_categoria == 2);
        console.log('--- DATOS CRUDOS DE API:', this.equipo);

        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.cargando = false;
      }
    });
  }
}
