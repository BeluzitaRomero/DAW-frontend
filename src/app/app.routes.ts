import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModificacionComponent } from './components/modificacion/modificacion.component';

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
    loadComponent: () =>
      import('./components/encuesta-form/encuesta-form.component').then(
        (m) => m.EncuestaFormComponent,
      ),
  },

  // Modificar encuesta
  {
    path: 'encuesta/modificar/:id',
    component: ModificacionComponent
  },

  // Routes respuestas
  {
    path: 'respuesta/:id',
    loadComponent: () =>
      import('./pages/encuesta-respuesta.component').then(
        (m) => m.EncuestaRespuestaComponent,
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
