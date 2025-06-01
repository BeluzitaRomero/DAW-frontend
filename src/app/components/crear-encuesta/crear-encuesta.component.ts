import { Component } from '@angular/core';
import { EncuestasService } from '../../services/encuestas.service';
import { MessageService } from 'primeng/api';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { EncuestaFormComponent } from '../encuesta-form/encuesta-form.component';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';

@Component({
  selector: 'app-crear-encuesta',
  imports: [EncuestaFormComponent, DialogModule, ButtonModule],
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.css',
})
export class CrearEncuestaComponent {
  encuesta!: EncuestaDTO;
  idEncuesta!: number;
  linkRespuesta: string = '';
  linkResultados: string = '';
  mostrarModal: boolean = false;

  constructor(
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  guardarEncuesta(datos: CreateEncuestaDTO): void {
    this.encuestasService.crearEncuesta(datos).subscribe({
      next: (res) => {
        this.encuesta = res;
        this.linkRespuesta = `${window.location.origin}/respuesta/${res.id}?codigo=${res.codigoRespuesta}&tipo=RESPUESTA`;
        this.linkResultados = `${window.location.origin}/respuestas/${res.id}/paginadas?codigo=${res.codigoResultados}`;

        this.mostrarModal = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Encuesta creada',
          detail: 'La encuesta se creó correctamente.',
        });
      },
      error: (err) => {
        console.error('Error al crear encuesta:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear la encuesta',
          detail: 'Ocurrió un error al crear la encuesta.',
        });
      },
    });
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

  irAGestionar() {
    this.router.navigate([
      '/encuesta',
      this.encuesta.id,
      this.encuesta.codigoResultados,
      'resultados',
    ]);
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
