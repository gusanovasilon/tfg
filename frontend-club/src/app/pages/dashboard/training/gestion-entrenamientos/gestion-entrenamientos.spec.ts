import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEntrenamientos } from './gestion-entrenamientos';

describe('GestionEntrenamientos', () => {
  let component: GestionEntrenamientos;
  let fixture: ComponentFixture<GestionEntrenamientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionEntrenamientos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEntrenamientos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
