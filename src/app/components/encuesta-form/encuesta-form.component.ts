// import { Component } from '@angular/core';
// import {
//   FormArray,
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { InputTextModule } from 'primeng/inputtext';
// import { ButtonModule } from 'primeng/button';
// import { SelectModule } from 'primeng/select';
// import { TiposRespuestaEnum } from '../../enums/tipos-pregunta.enum';
// import { TipoEstadoEnum } from '../../enums/tipo-estado.enum';
// import { EncuestasService } from '../../services/encuestas.service';

// @Component({
//   selector: 'app-encuesta-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     InputTextModule,
//     ButtonModule,
//     SelectModule,
//   ],
//   templateUrl: './encuesta-form.component.html',
// })
// export class EncuestaFormComponent {
//   encuestaForm: FormGroup;

//   estados = [
//     { label: 'Borrador', value: TipoEstadoEnum.BORRADOR },
//     { label: 'Publicado', value: TipoEstadoEnum.PUBLICADO },
//   ];

//   tipos = [
//     {
//       label: 'Respuesta Abierta',
//       value: TiposRespuestaEnum.ABIERTA,
//     },
//     {
//       label: 'Selección Simple',
//       value: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
//     },
//     {
//       label: 'Selección Múltiple',
//       value: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
//     },
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private encuestasService: EncuestasService,
//   ) {
//     this.encuestaForm = this.fb.group({
//       nombre: ['', Validators.required],
//       descripcion: [''],
//       estado: [TipoEstadoEnum.BORRADOR, Validators.required],
//       preguntas: this.fb.array([]),
//     });

//     this.agregarPregunta();
//   }

//   get preguntas(): FormArray {
//     return this.encuestaForm.get('preguntas') as FormArray;
//   }

//   agregarPregunta(): void {
//     const pregunta = this.fb.group({
//       numero: [this.preguntas.length + 1],
//       texto: ['', Validators.required],
//       tipo: ['', Validators.required],
//       opciones: this.fb.array([]),
//     });

//     this.preguntas.push(pregunta);
//   }

//   eliminarPregunta(index: number): void {
//     this.preguntas.removeAt(index);
//   }

//   getOpciones(pregunta: FormGroup): FormArray {
//     return pregunta.get('opciones') as FormArray;
//   }

//   agregarOpcion(pregunta: FormGroup): void {
//     const opciones = this.getOpciones(pregunta);
//     opciones.push(
//       this.fb.group({
//         numero: [opciones.length + 1],
//         texto: ['', Validators.required],
//       }),
//     );
//   }

//   eliminarOpcion(pregunta: FormGroup, index: number): void {
//     const opciones = this.getOpciones(pregunta);
//     opciones.removeAt(index);
//   }

//   guardarEncuesta(): void {
//     if (this.encuestaForm.invalid) return;

//     const dto = this.encuestaForm.value;

//     this.encuestasService.crearEncuesta(dto).subscribe({
//       next: (res) => {
//         console.log('✅ Encuesta creada:', res);
//         alert('Encuesta guardada con éxito ✅');
//       },
//       error: (err) => {
//         console.error('❌ Error al guardar encuesta:', err);
//         alert('Hubo un error al guardar la encuesta ❌');
//       },
//     });
//   }
// }
import { Component } from '@angular/core';
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
import { TiposRespuestaEnum } from '../../enums/tipos-pregunta.enum';
import { TipoEstadoEnum } from '../../enums/tipo-estado.enum';
import { EncuestasService } from '../../services/encuestas.service';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    DialogModule, // se agrega para el modal
    ToastModule, // se agrega para el toast
  ],
  providers: [MessageService], // se agrega para el toast
  templateUrl: './encuesta-form.component.html',
})
export class EncuestaFormComponent {
  encuestaForm: FormGroup;

  estados = [
    { label: 'Borrador', value: TipoEstadoEnum.BORRADOR },
    { label: 'Publicado', value: TipoEstadoEnum.PUBLICADO },
  ];

  tipos = [
    { label: 'Respuesta Abierta', value: TiposRespuestaEnum.ABIERTA },
    {
      label: 'Selección Simple',
      value: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
    },
    {
      label: 'Selección Múltiple',
      value: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
    },
  ];

  tiposRespuestaEnum = TiposRespuestaEnum;

  constructor(
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private messageService: MessageService, // se agrega para el toast
    private router: Router, // se agrega para la navegación
  ) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [TipoEstadoEnum.BORRADOR, Validators.required],
      preguntas: this.fb.array([]),
    });

    this.agregarPregunta();
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

  mostrarModal: boolean = false;
  linkRespuesta: string | null = null;
  linkResultados: string | null = null;

  guardarEncuesta(): void {
    if (this.encuestaForm.invalid) return;

    const dto = this.encuestaForm.value;
    this.encuestasService.crearEncuesta(dto).subscribe({
      next: (res) => {
        const { id, codigoRespuesta, codigoResultados } = res;
        this.linkRespuesta = `http://localhost:3000/api/v1/encuestas/${id}?codigo=${codigoRespuesta}&tipo=RESPUESTA`; // Construir el enlace para RESPUESTAS
        this.linkResultados = `http://localhost:3000/api/v1/respuestas/${id}?codigo=${codigoResultados}&tipo=RESULTADOS`; // Construir el enlace para RESULTADOS
        this.mostrarModal = true; // Mostrar el modal
      },
      error: (err) => {
        console.error('❌ Error al guardar encuesta:', err);
        alert('Error al guardar la encuesta ❌');
      },
    });
  }

  copiarAlPortapapeles(codigo: string): void {
    navigator.clipboard.writeText(codigo).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'El código ha sido copiado al portapapeles',
        life: 3000, // Duración del mensaje en milisegundos
      });
    });
  }

  volver(): void {
    this.router.navigate(['/']); // Redirige a la página principal
  }
}
