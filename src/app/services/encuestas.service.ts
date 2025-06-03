import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateEncuestaDTO } from '../interfaces/create-encuesta.dto';
import { Observable } from 'rxjs';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../interfaces/encuesta.dto';
// import { TiposEstadoEnum } from '../enums/tipo-estado.enum';
import { ModificarEncuestaDTO } from '../interfaces/modificar-encuesta.dto';
import { EliminarPreguntasDTO } from '../interfaces/eliminar-pregunta.dto';

//Hukke---
interface Encuesta {
  id: number;
  nombre: string;
  estado: string;
  preguntas: any[]; // Pasar a pregunta
  codigoRespuesta: string;
}

interface EncuestasResponse {
  total: number;
  page: number;
  limit: number;
  data: EncuestaDTO[];
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EncuestasService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api/v1/encuestas';

  crearEncuesta(dto: CreateEncuestaDTO): Observable<EncuestaDTO> {
    return this.httpClient.post<EncuestaDTO>(this.baseUrl, dto);
  }

  buscarEncuesta(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
  ): Observable<EncuestaDTO> {
    return this.httpClient.get<EncuestaDTO>(
      `${this.baseUrl}/${idEncuesta}?codigo=${codigo}&tipo=${tipo}`,
    );
  }

  obtenerEncuestas(
    page: number = 1,
    limit: number = 3,
  ): Observable<EncuestasResponse> {
    return this.httpClient.get<EncuestasResponse>(
      `${this.baseUrl}?page=${page}&limit=${limit}`,
    );
  }

  modificarEncuesta(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
    data: Partial<ModificarEncuestaDTO>,
  ): Observable<ModificarEncuestaDTO> {
    return this.httpClient.patch<ModificarEncuestaDTO>(
      `${this.baseUrl}/${idEncuesta}?codigo=${codigo}&tipo=${tipo}`,
      data,
    );
  }

  cambiarEstado(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
    accion: 'publicar' | 'cerrar' | 'eliminar',
  ): Observable<{ affected: number }> {
    return this.httpClient.patch<{ affected: number }>(
      `${this.baseUrl}/${idEncuesta}/${accion}?codigo=${codigo}&tipo=${tipo}`,
      {},
    );
  }

  eliminarPreguntas(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
    preguntas: EliminarPreguntasDTO,
  ): Observable<any> {
    return this.httpClient.patch<EliminarPreguntasDTO>(
      `${this.baseUrl}/${idEncuesta}/eliminar-preguntas?codigo=${codigo}&tipo=${tipo}`,
      preguntas,
    );
  }
}
