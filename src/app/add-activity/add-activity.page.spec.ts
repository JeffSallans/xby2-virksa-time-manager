import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityPage } from './add-activity.page';

describe('AddActivityPage', () => {
  let component: AddActivityPage;
  let fixture: ComponentFixture<AddActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
