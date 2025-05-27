import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreguntasService {
  private baseUrl = '/api/v1/respuestas';

  constructor(private http: HttpClient) {}

  obtenerRespuestasPaginadasPorEncuesta(
    encuestaId: number,
    codigo: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<any> {
    const url = `${this.baseUrl}/${encuestaId}/paginadas?codigo=${codigo}&page=${page}&limit=${limit}`;
    console.log('URL generada para el backend:', url); // Verifica la URL generada
    return this.http.get<any>(url);
  }
}
