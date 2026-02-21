import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje, Conversacion } from '../interfaces/mensajesInterface';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  // URL base: http://localhost:8888/.../api/mensajes
  private apiUrl = `${environment.apiUrl}/mensajes`;

  constructor(private http: HttpClient) { }

  // ==========================================
  // 1. OBTENER LISTA DE CHATS (Bandeja de Entrada)
  // ==========================================
  // Llama a: GET api/mensajes/5
  getMisConversaciones(userId: number): Observable<Conversacion[]> {
    return this.http.get<Conversacion[]>(`${this.apiUrl}/${userId}`);
  }

  // ==========================================
  // 2. OBTENER MENSAJES DE UN CHAT CONCRETO
  // ==========================================
  // Llama a: GET api/mensajes/chat/45
  getMensajesDeConversacion(chatId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/chat/${chatId}`);
  }

  // ==========================================
  // 3. BORRAR CONVERSACIÓN ENTERA
  // ==========================================
  // Llama a: DELETE api/mensajes/chat/45
  borrarConversacion(chatId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/chat/${chatId}`);
  }

  // ==========================================
  // 4. ENVIAR MENSAJE (Crea el chat si no existe)
  // ==========================================
  // Llama a: POST api/mensajes
  // El backend se encarga de calcular el conversacion_id si falta.
  enviarMensaje(mensaje: Mensaje): Observable<any> {

    console.log('Servicio recibiendo:', mensaje); // <--- ¿Qué llega aquí?
    console.log('¿Tiene ID?', mensaje.conversacion_id);

    // Verificamos si existe Y si es mayor que 0
    if (mensaje.conversacion_id && mensaje.conversacion_id > 0) {
       console.log('--> Enviando por ruta CON ID (Responder)');
       return this.http.post<any>(`${this.apiUrl}/${mensaje.conversacion_id}`, mensaje);
    }
    else {
       console.log('--> Enviando por ruta SIN ID (Nuevo Chat)');
       return this.http.post<any>(this.apiUrl, mensaje);
    }
  }

  eliminarSalaCompleta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sala/${id}`);
  }

  enviarAvisoGlobal(remitente_id: number, cuerpo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/aviso-global`, {
      remitente_id: remitente_id,
      cuerpo: cuerpo
    });
  }


}
