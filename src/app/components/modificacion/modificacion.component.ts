import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TipoEstadoEnum } from '../../enums/tipo-estado.enum';
import { EncuestaFormComponent } from '../encuesta-form/encuesta-form.component';

@Component({
  selector: 'app-modificacion',
  imports: [CommonModule, EncuestaFormComponent],
  templateUrl: './modificacion.component.html',
  styleUrl: './modificacion.component.css',
})
export class ModificacionComponent {
  tipoEstadoEnum = TipoEstadoEnum;

  encuesta!: EncuestaDTO;
  codigo!: string;
  tipo!: CodigoTipoEnum;
  cargando: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private encuestasService: EncuestasService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      console.log('Query Params:', params.keys);
      console.log('codigo:', params.get('codigo'));
      console.log('tipo:', params.get('tipo'));
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.codigo = this.route.snapshot.queryParamMap.get('codigo') || '';
    this.tipo =
      (this.route.snapshot.queryParamMap.get('tipo') as CodigoTipoEnum) || '';

    if (!id || !this.codigo || this.tipo !== CodigoTipoEnum.RESULTADOS) {
      this.error = 'Datos de acceso inválidos.';
      this.cargando = false;
      return;
    }

    this.encuestasService.buscarEncuesta(id, this.codigo, this.tipo).subscribe({
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

  cerrarEncuesta(): void {
    this.encuestasService
      .cambiarEstado(this.encuesta.id, this.codigo, this.tipo, 'cerrar')
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Encuesta actualizada',
            detail: 'La encuesta fue modificada correctamente.',
          });
        },
        error: (err) => {
          console.error('❌ Error al actualizar encuesta:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cerrar la encuesta',
            detail: 'La encuesta no se ha podido cerrar',
          });
        },
      });
  }

  publicarEncuesta(): void {
    this.encuestasService
      .cambiarEstado(this.encuesta.id, this.codigo, this.tipo, 'publicar')
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Encuesta actualizada',
            detail: 'La encuesta fue modificada correctamente.',
          });
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al publicar la encuesta',
            detail: 'La encuesta no se ha podido publicar',
          });
        },
      });
  }

  eliminarEncuesta(): void {
    this.encuestasService
      .cambiarEstado(this.encuesta.id, this.codigo, this.tipo, 'eliminar')
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Encuesta actualizada',
            detail: 'La encuesta fue modificada correctamente.',
          });
        },
        error: (err) => {
          console.error('❌ Error al actualizar encuesta:', err);
          alert('Error al actualizar la encuesta ❌');
        },
      });
  }
}
