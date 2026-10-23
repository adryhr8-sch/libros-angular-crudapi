import { Component, effect, input, output, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { LibrosApi } from '../../services/libros-api';
import Libro from '../../interfaces/libro';
import LibroId from '../../interfaces/libro-id';

function textoNoVacio(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim().length > 0
    ? null
    : { textoNoVacio: true };
}

function enteroPositivo(control: AbstractControl): ValidationErrors | null {
  return Number.isInteger(control.value) && control.value > 0
    ? null
    : { enteroPositivo: true };
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-formulario',
  styleUrl: './formulario.css',
  templateUrl: './formulario.html',
})
export class Formulario {
  private readonly librosapi = inject(LibrosApi);

  readonly currentYear = new Date().getFullYear();
  readonly libro = input<LibroId | null>(null);
  readonly guardado = output<LibroId>();

  readonly LibroForm = new FormGroup({
    id: new FormControl<number | null>(null),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200), textoNoVacio],
    }),
    author: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100), textoNoVacio],
    }),
    published_year: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(this.currentYear),
        enteroPositivo,
      ],
    }),
    pages: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1), enteroPositivo],
    }),
  });

  errorMessage = '';
  guardando = false;

  constructor() {
    effect(() => {
      const libro = this.libro();
      this.errorMessage = '';
      if (libro) {
        this.LibroForm.reset({
          id: libro.id,
          title: libro.title,
          author: libro.author,
          published_year: libro.published_year,
          pages: libro.pages,
        });
      } else {
        this.LibroForm.reset({ id: null, title: '', author: '', published_year: null, pages: null });
      }
    });
  }

  onSubmit(): void {
    if (this.LibroForm.invalid) {
      this.LibroForm.markAllAsTouched();
      return;
    }

    const { id, title, author, published_year, pages } = this.LibroForm.getRawValue();
    if (published_year === null || pages === null) {
      this.LibroForm.markAllAsTouched();
      return;
    }
    const libro: Libro = {
      title: title.trim(),
      author: author.trim(),
      published_year,
      pages,
    };
    this.errorMessage = '';
    this.guardando = true;

    const request = id === null
      ? this.librosapi.publicar_libro(libro)
      : this.librosapi.editar_libro(id, libro);

    request.subscribe({
      next: (guardado) => {
        this.guardando = false;
        this.guardado.emit(guardado);
      },
      error: (error) => {
        console.error('Error al guardar el libro:', error);
        this.guardando = false;
        this.errorMessage = 'No se pudo guardar el libro. Revisa tus datos e inténtalo de nuevo.';
      },
    });
  }
}
