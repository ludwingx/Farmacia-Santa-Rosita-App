import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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
  constructor(private serviceProduct: ProductsApiService) {}
  products?: IProductsList[];
  ngOnInit(): void {
   
    this.serviceProduct.getAllProducts().subscribe(
      {
       next: (prod: IProductsList[] | undefined) => {
        console.log(prod);
        this.products = prod;
       },
       error:(err) => {
        console.log(err)
       }
      }
      
    )
  }
  
  
}
