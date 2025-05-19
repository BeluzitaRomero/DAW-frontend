import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';

@Component({
  selector: 'app-encuesta-gestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encuesta-gestion.component.html',
})
export class EncuestaGestionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private encuestaService = inject(EncuestasService);

  encuesta: EncuestaDTO | null = null;
  cargando = true;
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const codigo = this.route.snapshot.paramMap.get('codigo');

    if (!id || !codigo) {
      this.error = 'Datos de acceso inválidos.';
      this.cargando = false;
      return;
    }

    this.encuestaService
      .buscarEncuesta(id, codigo, CodigoTipoEnum.RESULTADOS)
      .subscribe({
        next: (data) => {
          this.encuesta = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('❌ Error al obtener encuesta:', err);
          this.error = 'No se pudo cargar la encuesta.';
          this.cargando = false;
        },
      });
  }
}
