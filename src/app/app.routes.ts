import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModificarEncuestaComponent } from './components/modificar-encuesta/modificar-encuesta.component';
import { CrearEncuestaComponent } from './components/crear-encuesta/crear-encuesta.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  // Routes encuestas

  // Gestion encuesta
  {
    path: 'encuesta/:id/:codigo/resultados',
    loadComponent: () =>
      import('./components/encuesta-gestion/encuesta-gestion.component').then(
        (m) => m.EncuestaGestionComponent,
      ),
  },

  // Crear encuesta
  {
    path: 'encuesta',
    component: CrearEncuestaComponent,
  },

  // Modificar encuesta
  {
    path: 'encuesta/modificar/:id/:codigo/resultados',
    component: ModificarEncuestaComponent,
  },

  // Routes respuestas

  // Ver respuestas paginadas
  {
    path: 'respuestas/:id/paginadas',
    loadComponent: () =>
      import(
        './components/listado-respuestas/listado-respuestas.component'
      ).then((m) => m.ListadoRespuestasComponent),
  },

  // Crear encuesta
  {
    path: 'respuesta/:id',
    loadComponent: () =>
      import('./pages/encuesta-respuesta.component').then(
        (m) => m.EncuestaRespuestaComponent,
      ),
  },

  // Vista de respuestas sin paginación (opcional) no funciona aun
  {
    path: 'respuestas/:id',
    loadComponent: () =>
      import(
        './components/listado-respuestas/listado-respuestas.component'
      ).then((m) => m.ListadoRespuestasComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
