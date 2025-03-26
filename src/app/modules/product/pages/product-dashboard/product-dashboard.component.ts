import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { selectUserProfile } from '../../../auth/store/auth.selectors';
import { UserProfile } from '../../../auth/store/auth.state';
import { LoadingService } from '../../../shared/services/loading.service';
import { ProductService } from '../../services/product.service';
import { ProductDetails } from '../../types/product-details';

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './product-dashboard.component.html',
  styleUrl: './product-dashboard.component.scss',
})
export class ProductDashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'image',
    'name',
    'description',
    'createdBy',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<ProductDetails>();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  currentUser: UserProfile | null = null;

  filterForm: FormGroup;
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      dateRangeFrom: [null],
      dateRangeTo: [null],
    });
  }

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.loadProducts();
    this.store
      .select(selectUserProfile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        if (this.currentUser?.role === 'user') {
          this.displayedColumns = this.displayedColumns.filter(
            (column) => column !== 'createdBy'
          );
        }
      });
  }

  isProductCreatedByCurrentUser(product: ProductDetails): boolean {
    return this.currentUser?.id === product.createdBy._id;
  }

  onDeleteProduct(product: ProductDetails): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.loadingService.showLoading();
      this.productService
        .deleteProduct(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadProducts();
            this.loadingService.hideLoading();
            this.toastr.success('Product deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.loadingService.hideLoading();
            this.toastr.error('Failed to delete product');
          },
        });
    }
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 0;
        this.loadProducts();
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.filterForm.get('search')?.value);
  }

  onDateRangeChange(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loadingService.showLoading();
    const search = this.filterForm.get('search')?.value || '';
    const dateRangeFrom = this.filterForm.get('dateRangeFrom')?.value;
    const dateRangeTo = this.filterForm.get('dateRangeTo')?.value;

    const filters = {
      search,
      createdAtFrom: dateRangeFrom ? dateRangeFrom.toISOString() : '',
      createdAtTo: dateRangeTo ? dateRangeTo.toISOString() : '',
    };

    this.productService
      .getProducts(this.currentPage + 1, this.pageSize, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.totalItems = response.total;
          this.loadingService.hideLoading();
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loadingService.hideLoading();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
