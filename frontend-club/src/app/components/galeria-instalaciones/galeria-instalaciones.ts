import { Component, OnInit } from '@angular/core';
import { GaleriaService } from '../../services/galeriaService';
import { GaleriaItem } from '../../interfaces/galeriaInterface';

@Component({
  selector: 'app-galeria-instalaciones',
  standalone: false,
  templateUrl: './galeria-instalaciones.html',
  styleUrl: './galeria-instalaciones.css',
})
export class GaleriaInstalaciones implements OnInit {

  fotosInstalaciones: GaleriaItem[] = [];
  cargando: boolean = true;

  constructor(private galeriaService: GaleriaService) {}

  ngOnInit(): void {
    this.galeriaService.getGaleria().subscribe({
      next: (todasLasFotos) => {

        this.fotosInstalaciones = todasLasFotos.filter(foto => foto.id_categoria == 1);
        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.cargando = false;
      }
    });
  }
}
