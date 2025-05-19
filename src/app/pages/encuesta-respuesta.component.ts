import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../services/encuestas.service';
import { EncuestaDTO } from '../interfaces/encuesta.dto';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { NgFor, NgIf } from '@angular/common';
import {
  tiposPreguntaPresentacion,
  TiposRespuestaEnum,
} from '../enums/tipos-pregunta.enum';

@Component({
  selector: 'app-encuesta-respuesta',
  standalone: true,
  templateUrl: './encuesta-respuesta.component.html',
  imports: [NgFor, NgIf],
})
export class EncuestaRespuestaComponent implements OnInit {
  encuesta!: EncuestaDTO;
  cargando = true;
  tiposPreguntaPresentacion = tiposPreguntaPresentacion;

  private route = inject(ActivatedRoute);
  private encuestasService = inject(EncuestasService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const codigo = this.route.snapshot.queryParamMap.get('codigo');

    if (id && codigo) {
      this.encuestasService
        .buscarEncuesta(id, codigo, CodigoTipoEnum.RESPUESTA)
        .subscribe({
          next: (data) => {
            this.encuesta = data;
            this.cargando = false;
          },
          error: (err) => {
            console.error('Error al cargar encuesta', err);
            this.cargando = false;
          },
        });
    }
  }

  getPresentacion(tipo: TiposRespuestaEnum): string {
    return (
      this.tiposPreguntaPresentacion.find((t) => t.tipo === tipo)
        ?.presentacion || tipo
    );
  }
}
