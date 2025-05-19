import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Importa provideHttpClient
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/components/home/home.component';
import { ListadoEncuestasComponent } from './app/components/listado-encuestas/listado-encuestas.component';
import { ListadoRespuestasComponent } from './app/components/listado-respuestas/listado-respuestas.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'encuestas', component: ListadoEncuestasComponent },
  { path: 'respuestas/:id', component: ListadoRespuestasComponent },
  { path: '**', redirectTo: '/home' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configura las rutas
    provideHttpClient(), // Configura el cliente HTTP
  ],
}).catch((err) => console.error(err));

//http://localhost:4200/api front

// http://localhost:3000/api back

//proxy.conf es para un proxy inverso: significa que cuando queremos solicitar datos de nuestra api, en vez de hacerlo al
//lochalhost:3000, lo hacemos al localhost:4200/api (se encarga por detras a hacerlo al backend)
