import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateEncuestaDTO } from '../interfaces/create-encuesta.dto';
import { Observable } from 'rxjs';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../interfaces/encuesta.dto';

//Hukke---
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
//-----Despues pasar a archivos aparte de interfaces

// @Injectable({ providedIn: 'root' })
// export class EncuestasService {
//   private httpClient = inject(HttpClient);

//   crearEncuesta(dto: CreateEncuestaDTO): Observable<{
//     id: number;
//     codigoRespuesta: string;
//     codigoResultados: string;
//   }> {
//     return this.httpClient.post<{
//       id: number;
//       codigoRespuesta: string;
//       codigoResultados: string;
//     }>('/api/v1/encuestas', dto);
//   }

//   traerEncuesta(
//     idEncuesta: number,
//     codigo: string,
//     tipo: CodigoTipoEnum,
//   ): Observable<EncuestaDTO> {
//     return this.httpClient.get<EncuestaDTO>(
//       '/api/v1/encuestas/' + idEncuesta + '?codigo=' + codigo + '&tipo=' + tipo,
//     );
//   }

//   test() {
//     this.traerEncuesta(1, 'codigo-test', CodigoTipoEnum.RESPUESTA).subscribe({
//       next: (res) => console.log(res),
//       error: (err) => console.log(err),
//     });
//   }
// }
@Injectable({ providedIn: 'root' })
export class EncuestasService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api/v1/encuestas';

  // 🔹 Crear una nueva encuesta
  crearEncuesta(dto: CreateEncuestaDTO): Observable<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return this.httpClient.post<{
      id: number;
      codigoRespuesta: string;
      codigoResultados: string;
    }>(this.baseUrl, dto);
  }

  // 🔹 Obtener una encuesta específica
  traerEncuesta(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
  ): Observable<EncuestaDTO> {
    return this.httpClient.get<EncuestaDTO>(
      `${this.baseUrl}/${idEncuesta}?codigo=${codigo}&tipo=${tipo}`,
    );
  }

  // 🔹 Obtener listado de encuestas paginado (de Hukke)
  obtenerEncuestas(
    page: number = 1,
    limit: number = 3,
  ): Observable<EncuestasResponse> {
    return this.httpClient.get<EncuestasResponse>(
      `${this.baseUrl}?page=${page}&limit=${limit}`,
    );
  }

  // 🔹 Método de prueba
  test() {
    this.traerEncuesta(1, 'codigo-test', CodigoTipoEnum.RESPUESTA).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  }
}
