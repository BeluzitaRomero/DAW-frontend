import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';

@Component({
  selector: 'app-listado-encuestas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado-encuestas.component.html', // se agrega mediante la ruta
  styleUrls: ['./listado-encuestas.component.css'],
})
export class ListadoEncuestasComponent implements OnInit {
  encuestas: any[] = [];
  pagina = 1;
  limite = 3;
  total = 0;

  constructor(private encuestasService: EncuestasService) {}

  ngOnInit(): void {
    this.cargarEncuestas();
  }

  cargarEncuestas() {
    this.encuestasService.obtenerEncuestas(this.pagina, this.limite).subscribe(
      (resp) => {
        console.log('Respuesta del backend:', resp);
        this.encuestas = resp.data; // Lista de encuestas
        this.total = resp.total; // Total de encuestas
      },
      (error) => {
        console.error('Error al cargar encuestas:', error);
      },
    );
  }

  anterior() {
    this.pagina--;
    console.log('Página actual:', this.pagina);

    this.cargarEncuestas();
  }

  siguiente() {
    this.pagina++;
    console.log('Página actual:', this.pagina);

    this.cargarEncuestas();
  }

  enviarRespuestas(encuesta: any) {
    const respuestas = encuesta.preguntas.map((pregunta: any) => {
      if (pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE') {
        return {
          preguntaId: pregunta.id,
          respuesta: pregunta.opciones
            .filter((opcion: any) => opcion.seleccionada)
            .map((opcion: any) => opcion.texto),
        };
      } else {
        return {
          preguntaId: pregunta.id,
          respuesta: pregunta.respuesta,
        };
      }
    });

    console.log('Respuestas enviadas:', respuestas);
    // Aquí puedes enviar las respuestas al backend usando un servicio
  }
}
