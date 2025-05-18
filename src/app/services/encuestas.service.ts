import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Encuesta {
  id: number;
  nombre: string;
  estado: string;
  preguntas: any[];
  codigoRespuesta: string;
}

interface EncuestasResponse {
  total: number;
  page: number;
  limit: number;
  data: Encuesta[];
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  private baseUrl = '/api/v1/encuestas';

  constructor(private http: HttpClient) {}

  obtenerEncuestas(
    page: number = 1,
    limit: number = 3,
  ): Observable<EncuestasResponse> {
    return this.http.get<EncuestasResponse>(
      `${this.baseUrl}?page=${page}&limit=${limit}`,
    );
  }
}
