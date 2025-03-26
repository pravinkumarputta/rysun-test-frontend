import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { UserProfile } from '../../auth/store/auth.state';
import { CacheService } from '../services/cache.service';
import { LoadingService } from '../services/loading.service';
export const authCheckGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const routeDataCacheService = inject(CacheService);
  const loadingService = inject(LoadingService);
  const authService = inject(AuthService);
  loadingService.showLoading();

  if (authService.isAuthenticated()) {
    return routeDataCacheService
      .fetchAndCache<UserProfile>('profile', '0')
      .pipe(
        map((profile) => {
          if (
            !state.url.startsWith('/user') &&
            !state.url.startsWith('/product')
          ) {
            if (profile.role === 'user') {
              router.navigate(['/product/dashboard']);
              return false;
            } else if (profile.role === 'admin') {
              router.navigate(['/user/dashboard']);
              return false;
            }
          } else if (state.url.startsWith('/user')) {
            if (profile.role !== 'admin') {
              router.navigate(['/product/dashboard']);
              return false;
            }
          }

          return true;
        }),
        finalize(() => {
          loadingService.hideLoading();
        })
      );
  } else {
    loadingService.hideLoading();
    return true;
  }
};
