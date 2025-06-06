import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TiposEstadoEnum } from '../../enums/tipo-estado.enum';
import { EncuestaFormComponent } from '../encuesta-form/encuesta-form.component';
import { ModificarEncuestaDTO } from '../../interfaces/modificar-encuesta.dto';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-modificacion',
  imports: [CommonModule, EncuestaFormComponent, CardModule],
  templateUrl: './modificar-encuesta.component.html',
  styleUrl: './modificar-encuesta.component.css',
})
export class ModificarEncuestaComponent {
  tipoEstadoEnum = TiposEstadoEnum;

  encuesta!: EncuestaDTO;

  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private encuestasService: EncuestasService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const codigo = this.route.snapshot.paramMap.get('codigo') || '';

    if (!id || !codigo) {
      this.error = 'Datos de acceso inválidos.';
      this.cargando = false;
      return;
    }

    this.encuestasService
      .buscarEncuesta(id, codigo, CodigoTipoEnum.RESULTADOS)
      .subscribe({
        next: (encuesta) => {
          this.encuesta = encuesta;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar encuesta:', err);
          this.cargando = false;
        },
      });
  }

  guardarEncuestaModificada(event: {
    datos: ModificarEncuestaDTO;
    preguntasAEliminar: number[];
  }): void {
    const { datos, preguntasAEliminar } = event;

    if (preguntasAEliminar.length > 0) {
      this.encuestasService
        .eliminarPreguntas(
          this.encuesta.id,
          this.encuesta.codigoResultados,
          CodigoTipoEnum.RESULTADOS,
          { preguntas: preguntasAEliminar },
        )
        .subscribe();
    }

    this.encuestasService
      .modificarEncuesta(
        this.encuesta.id,
        this.encuesta.codigoResultados,
        CodigoTipoEnum.RESULTADOS,
        datos,
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Encuesta actualizada',
            detail: 'La encuesta fue modificada correctamente.',
          });
          this.router.navigate([
            '/encuesta',
            this.encuesta.id,
            this.encuesta.codigoResultados,
            'resultados',
          ]);
        },
        error: (err) => {
          console.error('Error al actualizar encuesta:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al modificar la encuesta.',
          });
        },
      });
  }
}
