import { Component } from '@angular/core';
import { FiltersProductsComponent } from './filters-products/filters-products.component';
import { ProductsComponent } from './products/products.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FiltersProductsComponent, ProductsComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  constructor (private router: Router) {
    
  }
  newProduct(){
    this.router.navigate(['inventory/products/new-product']).then(() => {
      window.scrollTo(0, 0);
  });
  }
  generatePDF(){

  }
}
