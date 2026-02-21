import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Entrenamiento } from '../interfaces/entrenamientosInterface';
 // Ajusta la ruta a tu environment

@Injectable({
  providedIn: 'root'
})
export class EntrenamientosService {

  private apiUrl = environment.apiUrl + "/entrenamientos";

  constructor(private http: HttpClient) { }


  // Obtener el tablón de entrenamientos
  getEntrenamientos(usuarioId?: number): Observable<any> {
    if (usuarioId) {
      // Si le pasamos ID, llama a: api/entrenamientos/12
      return this.http.get(`${this.apiUrl}/${usuarioId}`);
    }
    // Si no, llama a: api/entrenamientos
    return this.http.get(this.apiUrl);
  }

  // 2. Crear nueva clase (Entrenador)
  crearEntrenamiento(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }

  // 3. Borrar clase (Entrenador)
  borrarEntrenamiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 4. Apuntarse / Desapuntarse (Atleta)
  toggleInscripcion(usuarioId: number, entrenamientoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle-inscripcion`, {
      usuario_id: usuarioId,
      entrenamiento_id: entrenamientoId
    });
  }

  // 5. Ver quién asiste a una clase (Entrenador)
  getAsistentes(entrenamientoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/asistentes/${entrenamientoId}`);
  }

  // 6. Pasar lista (Entrenador)
  pasarLista(inscripcionId: number, asistencia: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pasar-lista/${inscripcionId}`, { asistencia });
  }

  actualizarEntrenamiento(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, datos);
  }
}
