import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/authInterface';
import { Ficha } from '../interfaces/fichaInterface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl + '/usuarios');
  }
  // Para actualizar el ROL o datos
  /* Partial es necesario ya que en el caso de solo actualizar ciertos campos del usuario los demás no van a ser pasados como parámetro entonces le decimos a angular que va a ser de tipo usuario pero que no siempre va a coincidir con la interface. */
  updateUsuario(id: number, data: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, data);
  }

  createUsuario(data:Ficha): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, data);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }
}
