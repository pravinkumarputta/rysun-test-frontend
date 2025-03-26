import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateOrEditComponent } from './user-create-or-edit.component';

describe('UserCreateOrEditComponent', () => {
  let component: UserCreateOrEditComponent;
  let fixture: ComponentFixture<UserCreateOrEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateOrEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreateOrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
