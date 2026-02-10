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

  enviarMensaje(mensaje: MensajeContacto): Observable<any> {
    return this.http.post(this.apiUrl + "/contacto", mensaje);
  }
}
