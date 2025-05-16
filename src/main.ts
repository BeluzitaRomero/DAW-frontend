import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);

//http://localhost:4200/api front

// http://localhost:3000/api back

//proxy.conf es para un proxy inverso: significa que cuando queremos solicitar datos de nuestra api, en vez de hacerlo al
//lochalhost:3000, lo hacemos al localhost:4200/api (se encarga por detras a hacerlo al backend)
