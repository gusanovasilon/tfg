import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeContacto } from '../interfaces/mensajeContactoInterface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //enviar y guardar los mensajes
  enviarMensaje(mensaje: MensajeContacto): Observable<any> {
    return this.http.post(this.apiUrl + "/contacto", mensaje);
  }
/* obtener todos los mensajes */
  getMensajes(): Observable<MensajeContacto[]> {
    return this.http.get<MensajeContacto[]>(this.apiUrl + "/mensajes");
  }

  /* borrar mensajes */
  borrarMensaje(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mensajes/${id}`);
  }
}
