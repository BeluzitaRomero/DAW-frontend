import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BuscarRespuestasDTO,
  CrearRespuestaDTO,
} from '../interfaces/respuesta.dto';

@Injectable({
  providedIn: 'root',
})
export class RespuestasService {
  private baseUrl = '/api/v1/respuestas';

  constructor(private http: HttpClient) {}

  obtenerRespuestasPaginadasPorEncuesta(
    encuestaId: number,
    codigo: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<BuscarRespuestasDTO> {
    const url = `${this.baseUrl}/${encuestaId}/paginadas?codigo=${codigo}&page=${page}&limit=${limit}`;
    return this.http.get<BuscarRespuestasDTO>(url);
  }

  crearRespuesta(
    id: number,
    codigo: string,
    dto: CrearRespuestaDTO,
  ): Observable<CrearRespuestaDTO> {
    const url = `${this.baseUrl}/${id}/?codigo=${codigo}&tipo=RESPUESTA`;
    return this.http.post<CrearRespuestaDTO>(url, dto);
  }
}
