import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  private baseUrl = '/api/encuestas';

  constructor(private http: HttpClient) {}

  obtenerEncuestas(page: number = 1, limit: number = 5) {
    return this.http.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
  }
}
