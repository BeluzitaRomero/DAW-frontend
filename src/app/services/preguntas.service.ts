import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreguntasService {
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  obtenerRespuestasPaginadasPorEncuesta(
    encuestaId: number,
    codigo: string,
    page: number = 1,
    limit: number = 3,
  ): Observable<any> {
    const url = `${this.baseUrl}/respuestas/${encuestaId}/paginadas?codigo=${codigo}&page=${page}&limit=${limit}&tipo=RESULTADOS`;
    return this.http.get<any>(url);
  }
}
