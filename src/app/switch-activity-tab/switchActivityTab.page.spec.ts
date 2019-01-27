import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchActivityTabPage } from './switchActivityTab.page';

describe('Tab2Page', () => {
  let component: SwitchActivityTabPage;
  let fixture: ComponentFixture<SwitchActivityTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchActivityTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchActivityTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
