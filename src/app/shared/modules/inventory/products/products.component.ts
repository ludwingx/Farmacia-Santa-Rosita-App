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
  getQuantityBackgroundStyle(totalQuantity: number): any {
    if (totalQuantity === 0) {
      return { 'color': 'red', 'font-weight': 'bold'}; // Si la cantidad total de lotes es 0, color de fondo rojo claro
    } else {
      return {}; // De lo contrario, no aplicar ningún estilo de fondo
    }
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
  getQuantityColorClass(quantity: number): string {
    if (quantity > 15) {
      return 'text-success'; // Cambiar a verde si la cantidad es mayor que 100
    } else if (quantity > 5) {
      return 'text-warning'; // Cambiar a amarillo si la cantidad está entre 51 y 100
    } else {
      return 'text-danger'; // Cambiar a rojo si la cantidad es 50 o menos
    }
  }
  editProduct(products: IProductsList){
    this.router.navigate(['inventory/products/edit-product', products.id]).then(() => {
      window.scrollTo(0, 0);
  });
  }
  isExpirationNear(expirationDate: Date): string {
    const expiration = new Date(expirationDate);
    const today = new Date();
    const differenceInDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
    if (differenceInDays < 1) {
      return 'text-danger'; // Si la fecha de vencimiento ya ha pasado, cambia a rojo
    } else if (differenceInDays <= 7) {
      return 'text-warning'; // Si faltan 7 días o menos para la fecha de vencimiento, cambia a amarillo
    } else {
      return 'text-success'; // Si queda más de una semana para la fecha de vencimiento, cambia a verde
    }
  }
  getQuantityClass(quantity: number, initialQuantity: number): string {
    const percentage = (quantity / initialQuantity) * 100;
    if (percentage <= 25) {
      return 'text-danger'; // Si la cantidad es menor o igual al 25%, cambia a rojo
    } else if (percentage <= 50) {
      return 'text-warning'; // Si la cantidad es menor o igual al 50%, cambia a amarillo
    } else {
      return 'text-success'; // Si la cantidad es mayor al 50%, cambia a verde
    }
  }
  getExpirationBackgroundStyle(expirationDate: Date): any {
    const expiration = new Date(expirationDate);
    const today = new Date();
    const differenceInDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (differenceInDays < 0) {
      return { 'background-color': '#FFCCCC' }; // Si la fecha de vencimiento ha pasado, color de fondo rojo claro
    } else if (differenceInDays <= 7) {
      return { 'background-color': '#FFFF99' }; // Si faltan 7 días o menos, color de fondo amarillo claro
    } else {
      return { 'background-color': '#CCFFCC' }; // Si queda más de una semana, color de fondo verde claro
    }
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