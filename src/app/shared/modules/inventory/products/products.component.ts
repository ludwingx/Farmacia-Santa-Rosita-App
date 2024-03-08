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
    this.router.navigate(['inventory/products/edit-product', products.id]).then(() => {
      window.scrollTo(0, 0);
  });
  }
  openDeleteConfirmationModal(product: IProductsList) {
    this.productToDelete = product; // Guarda el producto a eliminar
    // Muestra el modal de confirmación
    this.deleteConfirmationModal.nativeElement.classList.add('show');
    document.body.classList.add('modal-open');
  }

  closeDeleteConfirmationModal() {
    // Oculta el modal de confirmación
    this.deleteConfirmationModal.nativeElement.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
  confirmDelete() {
    // Lógica para eliminar el producto
    // ...

    // Cierra el modal después de confirmar la eliminación
    this.closeDeleteConfirmationModal();
  }
}