import { TiposEstadoEnum } from '../enums/tipo-estado.enum';
import { PreguntaDTO } from './pregunta.dto';

export interface EncuestaDTO {
  id: number;

  nombre: string;

  estado: TiposEstadoEnum;

  preguntas: PreguntaDTO[];

  codigoRespuesta: string;

  codigoResultados: string;
}
