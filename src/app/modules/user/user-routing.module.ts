import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCreateOrEditComponent } from './pages/user-create-or-edit/user-create-or-edit.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'create',
    component: UserCreateOrEditComponent,
  },
  {
    path: ':id/edit',
    component: UserCreateOrEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
