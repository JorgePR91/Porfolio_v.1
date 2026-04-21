import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usuaris } from './usuaris';

describe('Usuaris', () => {
  let component: Usuaris;
  let fixture: ComponentFixture<Usuaris>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usuaris]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Usuaris);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
