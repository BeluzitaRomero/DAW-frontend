import { Routes } from '@angular/router';
import { CreacionComponent } from './components/creacion/creacion.component';
import { HomeComponent } from './components/home/home.component';
import { EncuestaFormComponent } from './components/encuesta-form/encuesta-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'encuesta',
    loadComponent: () =>
      import('./components/encuesta-form/encuesta-form.component').then(
        (m) => m.EncuestaFormComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
