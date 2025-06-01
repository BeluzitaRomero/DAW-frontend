import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import {
  tiposPreguntaPresentacion,
  TiposRespuestaEnum,
} from '../../enums/tipos-pregunta.enum';
import {
  tipoEstadoEnumPresentacion,
  TiposEstadoEnum,
} from '../../enums/tipo-estado.enum';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { ModificarEncuestaDTO } from '../../interfaces/modificar-encuesta.dto';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { PreguntaDTO } from '../../interfaces/pregunta.dto';
import { PanelModule } from 'primeng/panel';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-encuesta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    ToastModule,
    PanelModule,
    IftaLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './encuesta-form.component.html',
})
export class EncuestaFormComponent implements OnInit {
  @Input() encuesta?: EncuestaDTO;
  @Input() mostrarModal: boolean = false;

  @Output() guardarEncuestaCreada = new EventEmitter<CreateEncuestaDTO>();
  @Output() guardarEncuestaModificada = new EventEmitter<{
    datos: ModificarEncuestaDTO;
    preguntasAEliminar: number[];
  }>();

  encuestaForm: FormGroup;

  tiposEstadoEnum = TiposEstadoEnum;

  tiposRespuestaEnum = TiposRespuestaEnum;

  codigoResultados: string = '';
  preguntasAEliminar: number[] = [];

  linkRespuesta: string | null = null;
  linkResultados: string | null = null;

  constructor(
    private fb: FormBuilder,
    private location: Location,
  ) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [TiposEstadoEnum.BORRADOR, Validators.required],
      preguntas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.encuesta) {
      this.encuestaForm.patchValue({
        nombre: this.encuesta.nombre,
      });
    } else {
      this.agregarPregunta();
    }
  }

  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  getTiposPreguntaPresentacion(): {
    tipo: TiposRespuestaEnum;
    presentacion: string;
  }[] {
    return tiposPreguntaPresentacion;
  }

  getTiposEstado(): {
    estado: TiposEstadoEnum;
    presentacion: string;
  }[] {
    return tipoEstadoEnumPresentacion.filter(
      (item) => item.estado !== TiposEstadoEnum.CERRADO,
    );
  }

  agregarPregunta(): void {
    const numeroMaxExistente =
      this.encuesta?.preguntas?.reduce(
        (max, pregunta) => Math.max(max, pregunta.numero || 0),
        0,
      ) ?? 0;

    const numeroPregunta = numeroMaxExistente + this.preguntas.length + 1;

    const pregunta = this.fb.group({
      numero: [numeroPregunta],
      texto: ['', Validators.required],
      tipo: ['', Validators.required],
      opciones: this.fb.array([]),
    });

    this.preguntas.push(pregunta);
  }

  eliminarPregunta(index: number): void {
    this.preguntas.removeAt(index);
  }

  getOpciones(pregunta: FormGroup): FormArray {
    return pregunta.get('opciones') as FormArray;
  }

  agregarOpcion(pregunta: FormGroup): void {
    this.getOpciones(pregunta).push(
      this.fb.group({
        numero: [this.getOpciones(pregunta).length + 1],
        texto: ['', Validators.required],
      }),
    );
  }

  eliminarOpcion(pregunta: FormGroup, index: number): void {
    this.getOpciones(pregunta).removeAt(index);
  }

  eliminarPreguntaExistente(idPregunta: number): void {
    this.preguntasAEliminar.push(idPregunta);
    this.encuesta!.preguntas = this.encuesta!.preguntas.filter(
      (p) => p.id !== idPregunta,
    );
  }

  guardarEncuesta(): void {
    if (this.encuestaForm.invalid) return;

    if (this.encuesta) {
      const nuevasPreguntas = this.encuestaForm.value.preguntas
        .filter((pregunta: PreguntaDTO) => !pregunta.id)
        .map((pregunta: PreguntaDTO) => ({
          numero: pregunta.numero,
          texto: pregunta.texto,
          tipo: pregunta.tipo,
          opciones: pregunta.opciones || [],
        }));

      const dtoModificar: ModificarEncuestaDTO = {
        nombre: this.encuestaForm.value.nombre,
        ...(nuevasPreguntas.length > 0 && { preguntas: nuevasPreguntas }),
      };

      this.guardarEncuestaModificada.emit({
        datos: dtoModificar,
        preguntasAEliminar: this.preguntasAEliminar,
      });
    } else {
      const dtoCrear: CreateEncuestaDTO = this.encuestaForm.value;
      this.guardarEncuestaCreada.emit(dtoCrear);
    }
  }

  volver(): void {
    this.location.back();
  }
}
