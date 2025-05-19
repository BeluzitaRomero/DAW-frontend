import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ListadoEncuestasComponent } from './components/listado-encuestas/listado-encuestas.component';
import { ListadoRespuestasComponent } from './components/listado-respuestas/listado-respuestas.component';
import { HomeComponent } from './components/home/home.component';

@Component({
  //nombre con el cual se va a referenciar nuestro componente en los html
  selector: 'app-root',

  //modulos o componentes standalone
  imports: [
    RouterOutlet,
    RouterLink, // para poder usar el routerLink y el routerLinkActive
    ConfirmDialogModule,
    ToastModule,
    ListadoEncuestasComponent,
    ListadoRespuestasComponent,
    HomeComponent,
  ],

  //adonde esta nuestro archivo html
  templateUrl: './app.component.html',

  //donde esta el archivo de estilos
  styleUrls: ['./app.component.css'],

  //configurar para que los modulos de primeng funcionen
  providers: [ConfirmationService, MessageService],
})
export class AppComponent {
  title = 'frontend';
}
