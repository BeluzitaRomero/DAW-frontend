import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-gestion',
  standalone: true,
  imports: [CommonModule, PanelModule, ButtonModule],
  templateUrl: './encuesta-gestion.component.html',
  styleUrls: ['./encuesta-gestion.component.css'],
})
export class EncuestaGestionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private encuestaService = inject(EncuestasService);

  constructor(private router: Router) {}

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

  editarEstado(): void {
    alert('🛠 Funcionalidad de editar estado en construcción');
  }

  irAEditar(): void {
    alert('🛠 Ir a editar encuesta - en construcción');
  }

  irARespuestas(): void {
    this.router.navigate(['/respuestas', this.encuesta?.id, 'paginadas'], {
      queryParams: {
        codigo: this.encuesta?.codigoResultados,
      },
    });
  }

  descargarCSV(): void {
    if (!this.encuesta?.id || !this.encuesta.codigoResultados) {
      alert('Faltan datos para generar el reporte');
      return;
    }

    const id = this.encuesta.id;
    const codigo = this.encuesta.codigoResultados;
    const url = `/api/v1/reportes/csv/${id}?codigo=${codigo}&tipo=RESULTADOS`;

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          const contentType = response.headers.get('Content-Type') || '';

          // Si el backend respondió con JSON, lo parseamos para mostrar el mensaje
          if (contentType.includes('application/json')) {
            const json = await response.json();
            throw new Error(json.message || 'Error al generar el reporte');
          } else {
            // Si respondió texto plano
            const text = await response.text();
            throw new Error(text || 'Error desconocido al generar el reporte');
          }
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `respuestas_encuesta_${id}.csv`;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((err) => {
        alert(`❌ ${err.message}`);
      });
  }
}
