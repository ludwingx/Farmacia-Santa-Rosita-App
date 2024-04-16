import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IProductsList } from '../../../../core/interfaces/products.interface';
import { ProductsApiService } from '../../../../core/services/products/products-api.service';
import { LotsApiService } from '../../../../core/services/lots/lots-api.service';
import { ILots } from '../../../../core/interfaces/lots';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  constructor(private serviceProduct: ProductsApiService,
     private router: Router,
     private serviceLots: LotsApiService) {}
  products: IProductsList[] = [];
  productToDelete: IProductsList | null = null;
  productStock: IProductsList[] = [];
  lots: ILots[]=[];
  ngOnInit(): void {
    this.loadProducts();
    this.serviceProduct.getProduct(1).subscribe((data: IProductsList | null) => {
      this.productStock = data ? [data] : []; 
      console.log(this.productStock);
    });
    this.loadLots();
  }
  loadProducts(): void {
    this.serviceProduct.getListProducts().subscribe(
      (data) => {
        this.products = data;
        console.log(data);
        // Asociar los lotes con los productos correspondientes
        this.products.forEach(product => {
          product.lots = this.lots.filter(lot => lot.product_id === product.id);
        });
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }
  loadLots(): void {
    this.serviceLots.getListLots().subscribe(
      (data) => {
        this.lots = data;
        console.log(data);
        // Asociar los lotes con los productos correspondientes
        this.products.forEach(product => {
          product.lots = this.lots.filter(lot => lot.product_id === product.id);
        });
      },
      (error) => {
        console.error('Error al obtener los lotes:', error);
      }
    );
  }
  formatProductId(id: number): string {
    // Añadir ceros a la izquierda usando padStart y especificar la longitud total
    return id.toString().padStart(3, '0');
  }
  calculateTotalQuantity(lots: ILots[]) {
    let totalQuantity = 0;
    if (lots && lots.length > 0) {
      for (let lot of lots) {
        totalQuantity += lot.quantity;
      }
    }
    return totalQuantity;
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