import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasEscritor } from './noticias-escritor';

describe('NoticiasEscritor', () => {
  let component: NoticiasEscritor;
  let fixture: ComponentFixture<NoticiasEscritor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoticiasEscritor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasEscritor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
