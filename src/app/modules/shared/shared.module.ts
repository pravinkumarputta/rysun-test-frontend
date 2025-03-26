import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedRoutingModule, RouterModule],
})
export class SharedModule {}
