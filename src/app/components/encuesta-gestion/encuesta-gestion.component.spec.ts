import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaGestionComponent } from './encuesta-gestion.component';

describe('EncuestaGestionComponent', () => {
  let component: EncuestaGestionComponent;
  let fixture: ComponentFixture<EncuestaGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuestaGestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
