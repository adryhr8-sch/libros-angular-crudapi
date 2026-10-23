import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Libro from '../interfaces/libro';
import LibroId from '../interfaces/libro-id';
import { Observable } from 'rxjs';

@Service()
export class LibrosApi {
  private url: string = 'http://127.0.0.1:8000/api/books/';
  private http = inject(HttpClient);

  lista_libros(): Observable<LibroId[]> {
    return this.http.get<LibroId[]>(this.url);
  }

  libro(id: number): Observable<Libro> {
    return this.http.get<Libro>(this.url + `${id}/`);
  }

  eliminar_libro(id: number): Observable<null> {
    return this.http.delete<null>(this.url + `${id}/`);
  }

  publicar_libro(libro: Libro): Observable<LibroId> {
    return this.http.post<LibroId>(this.url, libro);
  }

  editar_libro(id: number, libro: Libro): Observable<LibroId> {
    return this.http.put<LibroId>(this.url + `${id}/`, libro);
  }
}
