import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirhdayCardComponent } from './birhday-card.component';

describe('BirhdayCardComponent', () => {
  let component: BirhdayCardComponent;
  let fixture: ComponentFixture<BirhdayCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirhdayCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirhdayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
