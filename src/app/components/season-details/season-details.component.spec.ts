import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonDetailsComponent } from './season-details.component';

describe('SeasonDetailsComponent', () => {
  let component: SeasonDetailsComponent;
  let fixture: ComponentFixture<SeasonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SeasonDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
