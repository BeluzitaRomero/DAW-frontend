import { Routes } from '@angular/router';
import { ComienzoComponent } from './components/comienzo/comienzo.component';

export const routes: Routes = [
  {
    path: '',
    component: ComienzoComponent,
  },
  //Cuando no coincide con nada, va a la raiz
  { path: '**', redirectTo: '' },
];
