import { Component, inject, OnInit, signal } from '@angular/core';
import { LibroTarjeta } from '../../components/libro-tarjeta/libro-tarjeta';
import { Formulario } from '../../components/formulario/formulario';
import { LibrosApi } from '../../services/libros-api';
import LibroId from '../../interfaces/libro-id';

@Component({
  imports: [Formulario, LibroTarjeta],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  librosapi = inject(LibrosApi);

  libros = signal<LibroId[]>([]);
  libroSeleccionado: LibroId | null = null;
  errorMessage = '';

  ngOnInit(): void {
    this.cargarLibros();
  }

  seleccionarLibro(libro: LibroId): void {
    this.libroSeleccionado = libro;
  }

  guardarLibro(libro: LibroId): void {
    const index = this.libros().findIndex((actual) => actual.id === libro.id);
    if (index === -1) {
      this.libros.update((a) => [libro, ...a]);
    } else {
      this.libros.update((a) => a.map((actual) => actual.id === libro.id ? libro : actual));
    }
    this.libroSeleccionado = null;
    this.errorMessage = '';
  }

  eliminarLibro(id: number): void {
    this.librosapi.eliminar_libro(id).subscribe({
      next: () => {
        this.libros.update((a) => a.filter((libro) => libro.id !== id));
        if (this.libroSeleccionado?.id === id) {
          this.libroSeleccionado = null;
        }
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al eliminar el libro:', error);
        this.errorMessage = 'No se pudo eliminar el libro. Inténtalo de nuevo.';
      }
    });
  }

  private cargarLibros(): void {
    this.librosapi.lista_libros().subscribe({
      next: (libros) => {
        this.libros.update(() => libros);
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al obtener la lista de libros:', error);
        this.errorMessage = 'No se pudo cargar la lista de libros.';
      }
    });
  }
}
