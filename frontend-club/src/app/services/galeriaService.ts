import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GaleriaItem } from '../interfaces/galeriaInterface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {

  // Cambia esto por tu URL real de CodeIgniter
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getGaleria(): Observable<GaleriaItem[]> {
    return this.http.get<GaleriaItem[]>(this.apiUrl + "/galeria");
  }
}
