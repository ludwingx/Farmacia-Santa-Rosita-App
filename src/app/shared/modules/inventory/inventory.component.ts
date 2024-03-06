import { Component } from '@angular/core';
import { FiltersProductsComponent } from './filters-products/filters-products.component';
import { ProductsComponent } from './products/products.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FiltersProductsComponent, ProductsComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  
}
