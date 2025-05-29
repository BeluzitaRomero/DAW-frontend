import { Component } from '@angular/core';
import { EncuestasService } from '../../services/encuestas.service';
import { MessageService } from 'primeng/api';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { EncuestaFormComponent } from '../encuesta-form/encuesta-form.component';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-crear-encuesta',
  imports: [EncuestaFormComponent, DialogModule, ButtonModule],
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.css',
})
export class CrearEncuestaComponent {
  idEncuesta!: number;
  linkRespuesta = '';
  linkResultados = '';
  mostrarModal = false;

  constructor(
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  guardarEncuesta(datos: CreateEncuestaDTO): void {
    this.encuestasService.crearEncuesta(datos).subscribe({
      next: (res) => {
        this.idEncuesta = res.id;
        this.linkRespuesta = res.codigoRespuesta;
        this.linkResultados = res.codigoResultados;
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
    this.router.navigate(
      ['/encuesta', this.idEncuesta, this.linkResultados, 'resultados'],
      // {
      //   queryParams: { tipo: 'RESULTADOS' },
      // },
    );
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
