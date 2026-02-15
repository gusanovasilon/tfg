import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ficha, FichaResponse } from '../interfaces/fichaInterface';

@Injectable({
  providedIn: 'root'
})
export class FichaService {

  // Ajusta la ruta base apuntando a tu nuevo controlador
  private apiUrl = environment.apiUrl + '/fichadeportiva';

  constructor(private http: HttpClient) { }

  getFicha(idUsuario: number): Observable<FichaResponse> {
    return this.http.get<FichaResponse>(`${this.apiUrl}/${idUsuario}`);
  }

  /* usamos post por el tema de las imagenes */
  updateFicha(idUsuario: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${idUsuario}`, formData);
  }
}
