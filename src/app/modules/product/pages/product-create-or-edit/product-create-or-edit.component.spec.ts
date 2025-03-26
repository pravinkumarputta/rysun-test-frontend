import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateOrEditComponent } from './product-create-or-edit.component';

describe('ProductCreateOrEditComponent', () => {
  let component: ProductCreateOrEditComponent;
  let fixture: ComponentFixture<ProductCreateOrEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreateOrEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCreateOrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
