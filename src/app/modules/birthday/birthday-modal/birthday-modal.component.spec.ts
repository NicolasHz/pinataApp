import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayModalComponent } from './birthday-modal.component';

describe('BirthdayModalComponent', () => {
  let component: BirthdayModalComponent;
  let fixture: ComponentFixture<BirthdayModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
