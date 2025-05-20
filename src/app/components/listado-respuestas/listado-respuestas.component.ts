import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PreguntasService } from '../../services/preguntas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado-respuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-respuestas.component.html',
  styleUrls: ['./listado-respuestas.component.css'],
})
export class ListadoRespuestasComponent implements OnInit {
  encuestaId!: number;
  codigoResultados!: string; // Capturar el código de resultados
  respuestas: any[] = [];
  pagina = 1;
  limite = 10; // Puedes ajustar el límite según tus necesidades
  total = 0;

  constructor(
    private route: ActivatedRoute,
    private preguntasService: PreguntasService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.encuestaId = +params['id']; // Captura el ID de la encuesta
      this.codigoResultados = params['codigo']; // Captura el código de resultados
      this.cargarRespuestas(); // Llama a cargarRespuestas
    });
  }

  cargarRespuestas(): void {
    this.preguntasService
      .obtenerRespuestasPaginadasPorEncuesta(
        this.encuestaId,
        this.codigoResultados,
        this.pagina,
        this.limite,
      )
      .subscribe({
        next: (resp) => {
          this.respuestas = resp.data || [];
          this.total = resp.total || 0;

          if (this.respuestas.length === 0) {
            console.warn('No hay respuestas para mostrar.');
          }
        },
        error: (err) => {
          console.error('Error al cargar respuestas:', err);
        },
      });
  }

  anterior(): void {
    if (this.pagina > 1) {
      this.pagina--;
      this.cargarRespuestas();
    }
  }

  siguiente(): void {
    if (this.pagina * this.limite < this.total) {
      this.pagina++;
      this.cargarRespuestas();
    }
  }
}
