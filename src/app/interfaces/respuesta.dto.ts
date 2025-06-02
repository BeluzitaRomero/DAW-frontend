export interface RespuestaAbierta {
  idPregunta: number;
  texto: string;
}

export interface RespuestaOpcion {
  idOpcion: number;
}

export interface CrearRespuestaDTO {
  respuestasAbiertas?: RespuestaAbierta[];
  respuestasOpciones?: RespuestaOpcion[];
}

export interface BuscarRespuestasDTO {
  total: number;
  page: number;
  limit: number;
  data: [
    {
      formularioId: number;
      respuestas: [
        {
          pregunta: {
            id: number;
            texto: string;
          };
          respuesta: string;
        },
      ];
    },
  ];
}
