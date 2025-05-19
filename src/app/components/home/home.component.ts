import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1>Bienvenido a la página principal</h1>
    <p>Selecciona una opción del menú para continuar.</p>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
