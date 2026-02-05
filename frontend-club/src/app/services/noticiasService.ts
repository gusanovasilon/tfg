import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Noticia } from '../interfaces/noticiasInterface';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.apiUrl}/noticias`);
  }

  getNoticia(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}/noticias/${id}`);
  }


}
