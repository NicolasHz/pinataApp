import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountNavComponent } from './my-account-nav.component';

describe('MyAccountNavComponent', () => {
  let component: MyAccountNavComponent;
  let fixture: ComponentFixture<MyAccountNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAccountNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
