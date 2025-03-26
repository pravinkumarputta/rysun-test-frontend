import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../shared/types/paginated-response';
import { ProductCreateRequest } from '../types/product-create-request';
import { ProductDetails } from '../types/product-details';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://api.example.com/products'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getProducts(
    page: number,
    limit: number,
    filters: {
      search: string;
      createdAtFrom: string;
      createdAtTo: string;
    }
  ): Observable<PaginatedResponse<ProductDetails>> {
    return this.http.get<PaginatedResponse<ProductDetails>>(
      `${environment.apiBaseUrl}/products?page=${page}&limit=${limit}`,
      {
        params: {
          search: filters.search,
          createdAtFrom: filters.createdAtFrom,
          createdAtTo: filters.createdAtTo,
        },
      }
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/products/${productId}`
    );
  }

  createProduct(product: ProductCreateRequest): Observable<ProductDetails> {
    return this.http.post<ProductDetails>(
      `${environment.apiBaseUrl}/products`,
      product
    );
  }

  fetchProductById(productId: string): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(
      `${environment.apiBaseUrl}/products/${productId}`
    );
  }

  updateProduct(
    productId: string,
    product: ProductCreateRequest
  ): Observable<ProductDetails> {
    return this.http.put<ProductDetails>(
      `${environment.apiBaseUrl}/products/${productId}`,
      product
    );
  }
}
