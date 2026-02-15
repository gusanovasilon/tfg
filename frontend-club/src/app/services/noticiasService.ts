import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Noticia } from '../interfaces/noticiasInterface';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  // Asegúrate de que en environment.ts apiUrl es algo como '.../public/api'
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // obtener noticias
  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.apiUrl}/noticias`);
  }

  // una sola noticia
  getNoticia(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}/noticias/${id}`);
  }

  // Usar FormData para subir imágenes sino no se puede pasar imagenes a codeigniter desde angular
  crearNoticia(formData: FormData): Observable<any> {
    // Angular detecta que es FormData y configura las cabeceras solo
    return this.http.post(`${this.apiUrl}/noticias`, formData);
  }

  //  Importante: Usamos POST en vez de PUT
  // PHP/CodeIgniter a veces tiene problemas leyendo ficheros con PUT.
  // Al enviar a la ruta /noticias/ID con POST, el ResourceController lo entiende como Update.
  editarNoticia(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/noticias/${id}`, formData);
  }

  // 5. BORRAR (DELETE)
  borrarNoticia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/noticias/${id}`);
  }
}
