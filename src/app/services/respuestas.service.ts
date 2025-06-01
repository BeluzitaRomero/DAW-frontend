import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaDTO } from '../interfaces/respuesta.dto';

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
    return this.http.get<any>(url);
  }

  crearRespuesta(
    id: number,
    codigo: string,
    dto: RespuestaDTO,
  ): Observable<RespuestaDTO> {
    const url = `http://localhost:3000/api/v1/respuestas/${id}/?codigo=${codigo}&tipo=RESPUESTA`;
    return this.http.post<RespuestaDTO>(url, dto);
  }
}
