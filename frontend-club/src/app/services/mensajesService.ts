import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje, ConversacionAdmin } from '../interfaces/mensajesInterface';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  // URL base: http://localhost:8080/api/mensajes
  private apiUrl = `${environment.apiUrl}/mensajes`;

  constructor(private http: HttpClient) { }

  // ==========================================
  // 1. FUNCIONES PARA EL USUARIO (Atleta/Entrenador)
  // ==========================================
getMisMensajes(userId: number): Observable<Mensaje[]> {
  // Ahora la URL termina en /3
  return this.http.get<Mensaje[]>(`${this.apiUrl}/${userId}`);
}

enviarMensaje(mensaje: Mensaje): Observable<any> {
  return this.http.post<any>(this.apiUrl, mensaje);
}

marcarComoLeido(idMensaje: number): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/leer/${idMensaje}`, {});
}

borrarMensaje(idMensaje: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${idMensaje}`);
}

getConversacionesAdmin(): Observable<ConversacionAdmin[]> {
  const params = new HttpParams().set('admin', 'true');
  return this.http.get<ConversacionAdmin[]>(this.apiUrl, { params });
}

getChatCompleto(u1: number, u2: number): Observable<Mensaje[]> {
  let params = new HttpParams()
    .set('u1', u1.toString())
    .set('u2', u2.toString());
  return this.http.get<Mensaje[]>(`${this.apiUrl}/conversacion`, { params });
}

borrarConversacionEntera(u1: number, u2: number): Observable<any> {
  let params = new HttpParams()
    .set('u1', u1.toString())
    .set('u2', u2.toString());
  return this.http.delete<any>(`${this.apiUrl}/conversacion`, { params });
}

}
