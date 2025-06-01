import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { EncuestaDTO } from '../interfaces/encuesta.dto';
import { PreguntaDTO } from '../interfaces/pregunta.dto';
import {
  RespuestaAbierta,
  RespuestaDTO,
  RespuestaOpcion,
} from '../interfaces/respuesta.dto';
import { PreguntasService } from '../services/respuestas.service';
import { EncuestasService } from '../services/encuestas.service';
import { TiposRespuestaEnum } from '../enums/tipos-pregunta.enum';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';

@Component({
  standalone: true,
  selector: 'app-encuesta-respuesta',
  templateUrl: './encuesta-respuesta.component.html',
  styleUrl: './encuesta-respuesta.component.css',
  imports: [CommonModule, ReactiveFormsModule, PanelModule, CardModule],
})
export class EncuestaRespuestaComponent implements OnInit {
  private fb = inject(FormBuilder);

  id!: number;
  codigo!: string;
  tipo!: string;

  encuesta!: EncuestaDTO;
  preguntas: PreguntaDTO[] = [];
  form: FormGroup = this.fb.group({});

  constructor(
    private encuestasService: EncuestasService,
    private preguntasService: PreguntasService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
    });

    this.route.queryParamMap.subscribe((params) => {
      this.codigo = params.get('codigo')!;
      this.tipo = params.get('tipo')!;
      this.cargarEncuesta();
    });
  }

  cargarEncuesta() {
    this.encuestasService
      .buscarEncuesta(this.id, this.codigo, CodigoTipoEnum.RESPUESTA)
      .subscribe({
        next: (data: EncuestaDTO) => {
          this.encuesta = data;
          this.preguntas = data.preguntas;
          this.crearFormulario();
        },
        error: (error) => {
          console.error('Error al cargar encuesta', error);
        },
      });
  }

  crearFormulario() {
    this.preguntas.forEach((p) => {
      if (p.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE') {
        this.form.addControl(p.id.toString(), new FormControl([]));
      } else {
        this.form.addControl(p.id.toString(), new FormControl(''));
      }
    });
  }

  isChecked(preguntaId: number, opcionId: number): boolean {
    const value = this.form.get(preguntaId.toString())?.value;
    return Array.isArray(value) && value.includes(opcionId);
  }

  onCheckboxChange(preguntaId: number, opcionId: number, event: Event) {
    const control = this.form.get(preguntaId.toString());
    const checked = (event.target as HTMLInputElement).checked;
    let valores: number[] = control?.value || [];

    if (checked) {
      valores.push(opcionId);
    } else {
      valores = valores.filter((v) => v !== opcionId);
    }

    control?.setValue(valores);
  }

  enviarRespuestas() {
    const respuestasAbiertas: RespuestaAbierta[] = [];
    const respuestasOpciones: RespuestaOpcion[] = [];

    for (const [idPregunta, valor] of Object.entries(this.form.value)) {
      const pregunta = this.preguntas.find((p) => p.id === +idPregunta);

      if (!pregunta) continue;

      switch (pregunta.tipo) {
        case 'ABIERTA':
          if (typeof valor === 'string' && valor.trim() !== '') {
            respuestasAbiertas.push({
              idPregunta: +idPregunta,
              texto: valor.trim(),
            });
          }
          break;

        case 'OPCION_MULTIPLE_SELECCION_SIMPLE':
          if (valor) {
            respuestasOpciones.push({
              idOpcion: +valor,
            });
          }
          break;

        case 'OPCION_MULTIPLE_SELECCION_MULTIPLE':
          if (Array.isArray(valor) && valor.length > 0) {
            valor.forEach((idOpcion: number) =>
              respuestasOpciones.push({ idOpcion }),
            );
          }
          break;
      }
    }

    const payload: RespuestaDTO = {};
    if (respuestasAbiertas.length > 0) {
      payload.respuestasAbiertas = respuestasAbiertas;
    }
    if (respuestasOpciones.length > 0) {
      payload.respuestasOpciones = respuestasOpciones;
    }

    this.preguntasService
      .crearRespuesta(this.encuesta.id, this.encuesta.codigoRespuesta, payload)
      .subscribe({
        next: () => alert('¡Gracias por responder!'),
        error: (err) => {
          console.error('Error al enviar respuestas', err);
          console.log('Detalles del error:', err.error?.message);
        },
      });
  }
}
