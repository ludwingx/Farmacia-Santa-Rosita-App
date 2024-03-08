import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProductsList } from '../../../../core/interfaces/products.interface';
import { ProductsApiService } from '../../../../core/services/products/products-api.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  constructor(private serviceProduct: ProductsApiService, private router: Router) {}
  products: IProductsList[] = [];
  ngOnInit(): void {
    this.loadProducts();

  }

  loadProducts(): void {
    this.serviceProduct.getListProducts().subscribe(
      (data) => {
        this.products = data;
        console.log(this.products);
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  editProduct(products: IProductsList){
    this.router.navigate(['products/edit-product', products.id]);
  }
}
