import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'encuesta/:id/:codigo/resultados',
    loadComponent: () =>
      import('./components/encuesta-gestion/encuesta-gestion.component').then(
        (m) => m.EncuestaGestionComponent,
      ),
  },
  {
    path: 'respuesta/:id',
    loadComponent: () =>
      import('./pages/encuesta-respuesta.component').then(
        (m) => m.EncuestaRespuestaComponent,
      ),
  },
  {
    path: 'encuesta',
    loadComponent: () =>
      import('./components/encuesta-form/encuesta-form.component').then(
        (m) => m.EncuestaFormComponent,
      ),
  },
  {
    path: 'respuestas/:id/:codigo',
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
