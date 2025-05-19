import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaRespuestaComponent } from './encuesta-respuesta.component';

describe('EncuestaRespuestaComponent', () => {
  let component: EncuestaRespuestaComponent;
  let fixture: ComponentFixture<EncuestaRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuestaRespuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
