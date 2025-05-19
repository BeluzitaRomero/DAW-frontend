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
    page: number,
    limit: number,
  ): Observable<any> {
    const url = `/api/v1/respuestas/${encuestaId}/paginadas?page=${page}&limit=${limit}`;
    console.log('Llamando al backend con URL:', url);
    return this.http.get<any>(url);
  }
}
