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
  respuestas: any[] = [];
  pagina = 1;
  limite = 3;
  total = 0;

  constructor(
    private route: ActivatedRoute,
    private preguntasService: PreguntasService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.encuestaId = +params['id']; // Convierte el parámetro a número
      console.log('ID de la encuesta:', this.encuestaId);
      this.cargarRespuestas(); // Llama a cargarRespuestas con los valores almacenados
    });
  }

  cargarRespuestas() {
    console.log('Cargando respuestas para la página:', this.pagina);
    this.preguntasService
      .obtenerRespuestasPaginadasPorEncuesta(
        this.encuestaId,
        this.pagina,
        this.limite,
      )
      .subscribe(
        (resp) => {
          console.log('Respuestas del backend:', resp);
          this.respuestas = resp.data || [];
          this.total = resp.total || 0;

          if (this.respuestas.length === 0) {
            console.warn('No hay respuestas para mostrar.');
          }
        },
        (error) => {
          console.error('Error al cargar respuestas:', error);
        },
      );
  }

  anterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.cargarRespuestas(); // Reutiliza el método con los valores almacenados
    }
  }

  siguiente() {
    if (this.pagina * this.limite < this.total) {
      this.pagina++;
      this.cargarRespuestas(); // Reutiliza el método con los valores almacenados
    }
  }
}
