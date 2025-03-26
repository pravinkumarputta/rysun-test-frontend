import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProductRoutingModule } from './product-routing.module';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProductRoutingModule],
  providers: [ProductService],
})
export class ProductModule {}
