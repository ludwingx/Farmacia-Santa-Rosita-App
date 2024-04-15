import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  constructor(private serviceProduct: ProductsApiService, private router: Router) {}
  products: IProductsList[] = [];
  productToDelete: IProductsList | null = null;
//   export interface IProductsList {
//     id: number;
//     image: string;
//     name: string;
//     product_code: string;
//     description: string;
//     purchase_price: number;
//     selling_price: number;
//     current_stock: number;
//     initial_stock: number;
//     supplier_id: number;
//     nutritional_information: string;
//     notes: string;
//     create_at: Date;
//     update_at: Date;
//     create_by_user_id: number;
//     last_update_by_user_id: number;
//     status_id: number;
//     supplier: ISuplier;
//     category_id: ICategory;
//     storage_location: IStorage_location;
    
// }
  productStock: IProductsList[] = [];

  ngOnInit(): void {
    this.loadProducts();
    this.serviceProduct.getProduct(1).subscribe((data: IProductsList | null) => {
      this.productStock = data ? [data] : []; 
      console.log(this.productStock);
    });
  }
  loadProducts(): void {
    this.serviceProduct.getListProducts().subscribe(
      (data) => {
        this.products = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  editProduct(products: IProductsList){
    this.router.navigate(['inventory/products/edit-product', products.id]).then(() => {
      window.scrollTo(0, 0);
  });
  }
  openDeleteConfirmationModal(product: IProductsList) {
    this.productToDelete = product; // Guarda el producto a eliminar
    this.deleteConfirmationModal.nativeElement.classList.add('show');
    document.body.classList.add('modal-open');
  }

  closeDeleteConfirmationModal() {
    this.deleteConfirmationModal.nativeElement.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
  confirmDelete() {
    this.closeDeleteConfirmationModal();
  }
}