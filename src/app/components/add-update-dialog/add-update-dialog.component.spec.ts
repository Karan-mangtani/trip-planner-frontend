import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDialogComponent } from './add-update-dialog.component';

describe('AddUpdateDialogComponent', () => {
  let component: AddUpdateDialogComponent;
  let fixture: ComponentFixture<AddUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
