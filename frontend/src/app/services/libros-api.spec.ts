import { TestBed } from '@angular/core/testing';
import { LibrosApi } from './libros-api';

describe('LibrosApi', () => {
  let service: LibrosApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibrosApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
