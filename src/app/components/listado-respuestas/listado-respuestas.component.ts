import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PreguntasService } from '../../services/respuestas.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-listado-respuestas',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    AccordionModule,
    CardModule,
  ],
  templateUrl: './listado-respuestas.component.html',
  styleUrls: ['./listado-respuestas.component.css'],
})
export class ListadoRespuestasComponent implements OnInit {
  activeIndex: number | number[] | null = null;
  encuestaId!: number;
  codigoResultados!: string;
  respuestas: {
    formularioId: number;
    respuestas: {
      pregunta: { id: number; texto: string };
      respuesta: string;
    }[];
  }[] = [];

  pagina: number = 1;
  limite: number = 10;
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private preguntasService: PreguntasService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.encuestaId = +params.get('id')!;
    });

    this.route.queryParamMap.subscribe((query) => {
      this.codigoResultados = query.get('codigo')!;
      this.cargarRespuestas();
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
        },
        error: (err) => {
          console.error('Error al cargar respuestas:', err);
        },
      });
  }

  siguiente(): void {
    if (this.pagina * this.limite < this.total) {
      this.pagina++;
      this.activeIndex = null;
      this.cargarRespuestas();
    }
  }

  anterior(): void {
    if (this.pagina > 1) {
      this.pagina--;
      this.activeIndex = null;
      this.cargarRespuestas();
    }
  }

  cambiarLimite(): void {
    this.pagina = 1;
    this.cargarRespuestas();
  }
  get totalPaginas(): number {
    return Math.ceil(this.total / this.limite);
  }
}
