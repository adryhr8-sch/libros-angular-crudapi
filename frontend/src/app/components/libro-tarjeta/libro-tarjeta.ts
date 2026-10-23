import { Component, input, output } from '@angular/core';
import LibroId from '../../interfaces/libro-id';

@Component({
  imports: [],
  selector: 'app-libro-tarjeta',
  styleUrl: './libro-tarjeta.css',
  templateUrl: './libro-tarjeta.html',
})
export class LibroTarjeta {
  libro = input.required<LibroId>();
  seleccionado = input(false);
  seleccionar = output<LibroId>();
  eliminar = output<number>();
}
