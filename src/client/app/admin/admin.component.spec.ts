import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService } from '../data/data.service';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    let dataServiceStub = {};

    TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      providers:    [ {provide: DataService, useValue: dataServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

