import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrenamiento } from '../interfaces/entrenamientosInterface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntrenamientosService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getEntrenamientos(soloFuturas: boolean = false): Observable<Entrenamiento[]> {
    const params = soloFuturas ? '?proximas=true' : '';
    return this.http.get<Entrenamiento[]>(`${this.apiUrl}/entrenamientos${params}`);
  }


  getEntrenamiento(id: number): Observable<Entrenamiento> {
    return this.http.get<Entrenamiento>(`${this.apiUrl}/entrenamientos/${id}`);
  }
}
