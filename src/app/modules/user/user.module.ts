import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserService } from './services/user.service';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UserRoutingModule],
  providers: [UserService],
})
export class UserModule {}
