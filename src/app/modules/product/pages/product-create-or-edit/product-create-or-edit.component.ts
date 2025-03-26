import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CacheService } from '../../../shared/services/cache.service';
import { ProductService } from '../../services/product.service';
import { ProductDetails } from '../../types/product-details';

@Component({
  selector: 'app-product-create-or-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-create-or-edit.component.html',
  styleUrl: './product-create-or-edit.component.scss',
})
export class ProductCreateOrEditComponent implements OnInit {
  productForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  productData: ProductDetails | null = null;
  isEditMode = false;
  productId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private cacheService: CacheService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      image: [null],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['productId'];
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.productData = data['routeData'].product as ProductDetails;
      this.isEditMode = true;
      this.loadProductData();
    });
  }

  private loadProductData(): void {
    if (this.productId) {
      this.productForm.patchValue({
        name: this.productData?.name,
        description: this.productData?.description,
        image: this.productData?.image,
      });
      this.imagePreview = this.productData?.image || null;
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.productForm.patchValue({
        image: file,
      });
    }
  }

  onSubmit(): void {
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      this.isLoading = true;

      const productData = {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        image: 'https://picsum.photos/400/400', // Hardcoded picsum URL
      };

      const operation = this.isEditMode
        ? this.productService.updateProduct(this.productId!, productData)
        : this.productService.createProduct(productData);

      operation.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: ProductDetails) => {
          this.isLoading = false;
          this.toastr.success(
            `Product ${this.isEditMode ? 'updated' : 'created'} successfully!`,
            'Success'
          );
          if (this.isEditMode) {
            this.cacheService.burstCache('product');
          }
          this.router.navigate(['/product/dashboard']);
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.toastr.error(
            `Error ${
              this.isEditMode ? 'updating' : 'creating'
            } product. Please try again.`,
            'Error'
          );
          console.error(
            `Error ${this.isEditMode ? 'updating' : 'creating'} product:`,
            error
          );
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
