import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import {
  tiposPreguntaPresentacion,
  TiposRespuestaEnum,
} from '../../enums/tipos-pregunta.enum';
import { TipoEstadoEnum } from '../../enums/tipo-estado.enum';
import { EncuestasService } from '../../services/encuestas.service';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { ModificarEncuestaDTO } from '../../interfaces/modificar-encuesta.dto';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
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
    DialogModule,
    ToastModule,
    PanelModule,
    IftaLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './encuesta-form.component.html',
})
export class EncuestaFormComponent implements OnInit {
  @Input() encuesta?: EncuestaDTO;
  @Input() encuestaCodigo!: string;
  @Input() encuestaTipo!: CodigoTipoEnum;

  encuestaForm: FormGroup;

  estados = [
    { label: 'Borrador', value: TipoEstadoEnum.BORRADOR },
    { label: 'Publicado', value: TipoEstadoEnum.PUBLICADO },
  ];

  getTiposPreguntaPresentacion(): {
    tipo: TiposRespuestaEnum;
    presentacion: string;
  }[] {
    return tiposPreguntaPresentacion;
  }

  tiposRespuestaEnum = TiposRespuestaEnum;

  preguntasAEliminar: number[] = [];

  mostrarModal = false;
  linkRespuesta: string | null = null;
  linkResultados: string | null = null;

  constructor(
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [TipoEstadoEnum.BORRADOR, Validators.required],
      preguntas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.encuesta) {
      console.log(this.encuesta);
      this.encuestaForm.patchValue({
        nombre: this.encuesta.nombre,
      });

      this.preguntas.clear();
    } else {
      this.agregarPregunta();
    }
  }

  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  agregarPregunta(): void {
    const pregunta = this.fb.group({
      numero: [this.preguntas.length + 1],
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

  eliminarPreguntaExistente(idPregunta: number, index: number): void {
    this.preguntasAEliminar.push(idPregunta);
    this.encuesta!.preguntas = this.encuesta!.preguntas.filter(
      (p) => p.id !== idPregunta,
    );
  }

  guardarEncuesta(): void {
    if (this.encuestaForm.invalid) return;

    if (this.encuesta) {
      if (this.preguntasAEliminar.length > 0) {
        this.encuestasService
          .eliminarPreguntas(
            this.encuesta!.id,
            this.encuestaCodigo,
            this.encuestaTipo,
            { preguntas: this.preguntasAEliminar },
          )
          .subscribe({
            next: () => {
              console.log('✅ Preguntas eliminadas correctamente');
            },
            error: (err) => {
              console.error('❌ Error al eliminar preguntas:', err);
              alert('Error al eliminar las preguntas ❌');
            },
          });
      }

      const nuevasPreguntas = this.encuestaForm.value.preguntas
        .filter((p: PreguntaDTO) => !p.id)
        .map((p: PreguntaDTO) => ({
          numero: p.numero,
          texto: p.texto,
          tipo: p.tipo,
          opciones: p.opciones || [],
        }));

      const dtoModificar: ModificarEncuestaDTO = {
        nombre: this.encuestaForm.value.nombre,
        ...(nuevasPreguntas.length > 0 && { preguntas: nuevasPreguntas }),
      };

      this.encuestasService
        .modificarEncuesta(
          this.encuesta.id,
          this.encuestaCodigo,
          this.encuestaTipo,
          dtoModificar,
        )
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Encuesta actualizada',
              detail: 'La encuesta fue modificada correctamente.',
            });
            this.volver();
          },
          error: (err) => {
            console.error('❌ Error al actualizar encuesta:', err);
            alert('Error al actualizar la encuesta ❌');
          },
        });
    } else {
      const dto: CreateEncuestaDTO = this.encuestaForm.value;
      this.encuestasService.crearEncuesta(dto).subscribe({
        next: (res) => {
          const { id, codigoRespuesta, codigoResultados } = res;
          this.linkRespuesta = `http://localhost:3000/api/v1/encuestas/${id}?codigo=${codigoRespuesta}&tipo=RESPUESTA`;
          this.linkResultados = `http://localhost:4200/respuestas/${id}/${codigoResultados}`;
          this.mostrarModal = true;
        },
        error: (err) => {
          console.error('❌ Error al guardar encuesta:', err);
          alert('Error al guardar la encuesta ❌');
        },
      });
    }
  }

  copiarAlPortapapeles(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'El enlace ha sido copiado al portapapeles',
        life: 3000,
      });
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
