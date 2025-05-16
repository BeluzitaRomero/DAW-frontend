import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  //nombre con el cual se va a referenciar nuestro componente en los html
  selector: 'app-root',

  //modulos o componentes standalone
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule],

  //adonde esta nuestro archivo html
  templateUrl: './app.component.html',

  //donde esta el archivo de estilos
  styleUrl: './app.component.css',

  //configurar para que los modulos de primeng funcionen
  providers: [ConfirmationService, MessageService],
})
export class AppComponent {
  title = 'frontend';
}
