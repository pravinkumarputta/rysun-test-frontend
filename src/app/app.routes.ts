import { Routes } from '@angular/router';
import { AuthWrapperComponent } from './modules/shared/components/auth-wrapper/auth-wrapper.component';
import { authCheckGuard } from './modules/shared/guards/auth-check.guard';
import { authGuard } from './modules/shared/guards/auth.guard';
export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [authCheckGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user',
    component: AuthWrapperComponent,
    canActivate: [authGuard, authCheckGuard],
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'product',
    component: AuthWrapperComponent,
    canActivate: [authGuard, authCheckGuard],
    loadChildren: () =>
      import('./modules/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
