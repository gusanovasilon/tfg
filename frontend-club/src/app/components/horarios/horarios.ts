import { Component } from '@angular/core';

@Component({
  selector: 'app-horarios',
  standalone: false,
  templateUrl: './horarios.html',
  styleUrl: './horarios.css',
})
export class Horarios {
  dias = [
    {
      nombre: 'LUNES',
      clases: [
        {
          grupo: 'Escuela Infantil',
          hora: '18:30 - 19:30',
          color: '#ff9100'
        },
        {
          grupo: 'Adultos / Acondicionamiento',
          hora: '19:45 - 21:00',
          color: '#1e3c72'
        }
      ]
    },
    {
      nombre: 'MIÉRCOLES',
      clases: [
        {
          grupo: 'Escuela Infantil',
          hora: '18:30 - 19:30',
          color: '#ff9100'
        },
        {
          grupo: 'Adultos / Técnica',
          hora: '19:45 - 21:00',
          color: '#1e3c72'
        }
      ]
    },
    {
      nombre: 'VIERNES',
      clases: [
        {
          grupo: 'Escuela Infantil',
          hora: '18:30 - 19:30',
          color: '#ff9100'
        },
        {
          grupo: 'Sparring',
          hora: '19:45 - 21:00',
          color: '#1e3c72'
        }
      ]
    },
  ];
}
