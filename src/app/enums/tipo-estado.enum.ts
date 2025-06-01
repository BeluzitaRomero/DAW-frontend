export enum TiposEstadoEnum {
  BORRADOR = 'BORRADOR',
  PUBLICADO = 'PUBLICADO',
  CERRADO = 'CERRADO',
}

export const tipoEstadoEnumPresentacion: {
  estado: TiposEstadoEnum;
  presentacion: string;
}[] = [
  { estado: TiposEstadoEnum.BORRADOR, presentacion: 'Borrador' },
  { estado: TiposEstadoEnum.PUBLICADO, presentacion: 'Publicado' },
  { estado: TiposEstadoEnum.CERRADO, presentacion: 'Cerrado' },
];
