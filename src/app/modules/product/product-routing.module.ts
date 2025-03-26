import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routeDataResolver } from '../shared/resolver/route-data.resolver';
import { ProductCreateOrEditComponent } from './pages/product-create-or-edit/product-create-or-edit.component';
import { ProductDashboardComponent } from './pages/product-dashboard/product-dashboard.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: ProductDashboardComponent,
  },
  {
    path: 'create',
    component: ProductCreateOrEditComponent,
  },
  {
    path: ':productId/edit',
    component: ProductCreateOrEditComponent,
    resolve: {
      routeData: routeDataResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
