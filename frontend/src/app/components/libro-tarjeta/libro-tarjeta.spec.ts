import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibroTarjeta } from './libro-tarjeta';

describe('LibroTarjeta', () => {
  let component: LibroTarjeta;
  let fixture: ComponentFixture<LibroTarjeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroTarjeta],
    }).compileComponents();

    fixture = TestBed.createComponent(LibroTarjeta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
