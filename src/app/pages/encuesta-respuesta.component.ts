import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-encuesta-respuesta',
  templateUrl: './encuesta-respuesta.component.html',
  styleUrl: './encuesta-respuesta.component.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class EncuestaRespuestaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  id!: string;
  codigo!: string;
  tipo!: string;

  encuesta: any = null;
  preguntas: any[] = [];
  form: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
    });

    this.route.queryParamMap.subscribe((params) => {
      this.codigo = params.get('codigo')!;
      this.tipo = params.get('tipo')!;
      this.cargarEncuesta();
    });
  }

  cargarEncuesta() {
    const url = `http://localhost:3000/api/v1/encuestas/${this.id}?codigo=${this.codigo}&tipo=${this.tipo}`;

    this.http.get(url).subscribe({
      next: (data: any) => {
        this.encuesta = data;
        this.preguntas = data.preguntas;
        console.log('Preguntas cargadas:', this.preguntas);
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
    const respuestasAbiertas: any[] = [];
    const respuestasOpciones: any[] = [];

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

    const payload: any = {};
    if (respuestasAbiertas.length > 0) {
      payload.respuestasAbiertas = respuestasAbiertas;
    }
    if (respuestasOpciones.length > 0) {
      payload.respuestasOpciones = respuestasOpciones;
    }

    const url = `http://localhost:3000/api/v1/respuestas/${this.id}?codigo=${this.codigo}&tipo=${this.tipo}`;

    this.http.post(url, payload).subscribe({
      next: () => alert('¡Gracias por responder!'),
      error: (err) => {
        console.error('Error al enviar respuestas', err);
        console.log('Detalles del error:', err.error?.message);
      },
    });
  }
}
