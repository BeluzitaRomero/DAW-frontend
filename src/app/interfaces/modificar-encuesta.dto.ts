import { TiposRespuestaEnum } from "../enums/tipos-pregunta.enum";

export interface ModificarEncuestaDTO {
  nombre?: string;
  preguntas?: {
    numero: number;
    texto: string;
    tipo: TiposRespuestaEnum;
    opciones?: {
      numero: number;
      texto: string;
    }[];
  }[];
}
