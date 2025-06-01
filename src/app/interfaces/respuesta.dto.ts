export interface RespuestaAbierta {
  idPregunta: number;
  texto: string;
}

export interface RespuestaOpcion {
  idOpcion: number;
}

export interface RespuestaDTO {
  respuestasAbiertas?: RespuestaAbierta[];
  respuestasOpciones?: RespuestaOpcion[];
}
