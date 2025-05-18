import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncuestasService } from '../../services/encuestas.service';

@Component({
  selector: 'app-listado-encuestas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="encuestas.length === 0">No hay encuestas para mostrar.</div>

    <div *ngFor="let encuesta of encuestas">
      <h3>{{ encuesta.nombre }}</h3>
      <p>ID: {{ encuesta.id }}</p>
    </div>

    <button (click)="anterior()" [disabled]="pagina <= 1">Anterior</button>
    <button (click)="siguiente()" [disabled]="pagina * limite >= total">
      Siguiente
    </button>
  `,
})
export class ListadoEncuestasComponent implements OnInit {
  encuestas: any[] = [];
  pagina = 1;
  limite = 5;
  total = 0;

  constructor(private encuestasService: EncuestasService) {}

  ngOnInit(): void {
    this.cargarEncuestas();
  }

  cargarEncuestas() {
    this.encuestasService
      .obtenerEncuestas(this.pagina, this.limite)
      .subscribe((resp: any) => {
        this.encuestas = resp.data;
        this.total = resp.total;
      });
  }

  anterior() {
    this.pagina--;
    this.cargarEncuestas();
  }

  siguiente() {
    this.pagina++;
    this.cargarEncuestas();
  }
}
