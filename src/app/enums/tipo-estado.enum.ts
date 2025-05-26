export enum TipoEstadoEnum {
  BORRADOR = 'BORRADOR',
  PUBLICADO = 'PUBLICADO',
  CERRADO = 'CERRADO',
}

export const tipoEstadoEnumPresentacion: {
  estado: TipoEstadoEnum;
  presentacion: string;
}[] = [
  { estado: TipoEstadoEnum.BORRADOR, presentacion: 'Borrador' },
  { estado: TipoEstadoEnum.PUBLICADO, presentacion: 'Publicado' },
  { estado: TipoEstadoEnum.CERRADO, presentacion: 'Cerrado' },
];
