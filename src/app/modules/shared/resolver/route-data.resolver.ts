import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { CacheService } from '../services/cache.service';
import { LoadingService } from '../services/loading.service';

export const routeDataResolver: ResolveFn<any> = (route, state) => {
  const routeDataCacheService = inject(CacheService);
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  const pathIdentifiers = routeDataCacheService.getRouteResolverConfigs();

  const serviceResolver: any = {};

  pathIdentifiers.forEach((identifier) => {
    if (identifier.key in route.params) {
      serviceResolver[identifier.valueKey] = identifier.resolver(
        route.params[identifier.key]
      );
    }
  });

  // Show loading indicator
  loadingService.showLoading();

  return forkJoin(serviceResolver).pipe(
    catchError((error) => {
      console.error('Error fetching data', error);
      router.navigate(['/error']); // Redirect to an error page
      return of(null); // Return null to prevent component from breaking
    }),
    finalize(() => loadingService.hideLoading())
  );
};
