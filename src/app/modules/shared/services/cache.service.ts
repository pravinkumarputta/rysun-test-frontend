import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ProductService } from '../../product/services/product.service';
import { ProductDetails } from '../../product/types/product-details';
export interface CacheItem<T> {
  id?: number;
  data: T | null;
  loading: boolean;
  error?: string;
}

export interface CacheConfig<T> {
  key: string;
  routeKey: string;
  fetchFn: (id: string) => Observable<T>;
  idExtractor?: (item: T) => string;
  resolver: (id: string) => Observable<T>;
}

export const ROUTE_DATA_KEYS = {
  profile: 'profile',
  product: 'product',
};

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cacheConfigs: CacheConfig<any>[] = [];
  private cacheMap = new Map<string, BehaviorSubject<CacheItem<any>>>();

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {
    this.initializeCaches();
  }

  private initializeCaches(): void {
    this.cacheConfigs = [
      {
        key: 'profile',
        routeKey: 'profileId',
        fetchFn: () => this.authService.fetchProfile(),
        resolver: (id) => this.fetchAndCache('profile', id),
      },
      {
        key: 'product',
        routeKey: 'productId',
        fetchFn: (id: string) => this.productService.fetchProductById(id),
        idExtractor: (product: ProductDetails) => product.id,
        resolver: (id) => this.fetchAndCache('product', id),
      },
    ];

    this.cacheConfigs.forEach((config) => {
      this.cacheMap.set(
        config.key,
        new BehaviorSubject<CacheItem<any>>({ data: null, loading: false })
      );
    });
  }

  getRouteResolverConfigs() {
    return this.cacheConfigs.map((config) => ({
      key: config.routeKey,
      valueKey: config.key,
      resolver: config.resolver,
    }));
  }

  private getCache<T>(
    key: keyof typeof ROUTE_DATA_KEYS
  ): BehaviorSubject<CacheItem<T>> {
    return this.cacheMap.get(key) as BehaviorSubject<CacheItem<T>>;
  }

  private getIdExtractor<T>(key: keyof typeof ROUTE_DATA_KEYS) {
    return this.cacheConfigs.find((config) => config.key === key)
      ?.idExtractor as (item: T) => string;
  }

  private getFetchFn<T>(key: keyof typeof ROUTE_DATA_KEYS) {
    return this.cacheConfigs.find((config) => config.key === key)?.fetchFn as (
      id: string
    ) => Observable<T>;
  }

  fetchAndCache<T>(
    key: keyof typeof ROUTE_DATA_KEYS,
    id: string
  ): Observable<T> {
    const cache = this.getCache<T>(key);
    const idExtractor = this.getIdExtractor<T>(key);
    const currentValue = cache.value;

    if (
      currentValue.data &&
      (!idExtractor || idExtractor(currentValue.data) === id)
    ) {
      return of(currentValue.data);
    }

    cache.next({ ...currentValue, loading: true, data: null });

    const fetchFn = this.getFetchFn<T>(key);
    return fetchFn(id).pipe(
      switchMap((data) => {
        cache.next({ data, loading: false });
        return of(data);
      })
    );
  }

  burstCache(key: keyof typeof ROUTE_DATA_KEYS): void {
    const cache = this.getCache(key);
    if (cache) {
      cache.next({ data: null, loading: false });
    }
  }

  burstAllCaches(): void {
    this.cacheMap.forEach((cache) => {
      cache.next({ data: null, loading: false });
    });
  }

  updateCache<T>(key: keyof typeof ROUTE_DATA_KEYS, data: T): void {
    const cache = this.getCache<T>(key);
    if (cache) {
      cache.next({ data, loading: false });
    }
  }
}
