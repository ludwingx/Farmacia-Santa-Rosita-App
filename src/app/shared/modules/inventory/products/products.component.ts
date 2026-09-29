import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IProductsList } from '../../../../core/interfaces/products.interface';
import { ProductsApiService } from '../../../../core/services/products/products-api.service';
import { LotsApiService } from '../../../../core/services/lots/lots-api.service';
import { ILots } from '../../../../core/interfaces/lots';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  constructor(
    private serviceProduct: ProductsApiService,
    private router: Router,
    private serviceLots: LotsApiService
  ) {}

  products: IProductsList[] = [];
  filteredProducts: IProductsList[] = [];
  searchTerm: string = '';
  productToDelete: IProductsList | null = null;
  productStock: IProductsList[] = [];
  lots: ILots[] = [];

  ngOnInit(): void {
    this.loadProducts();
    this.loadLots();
  }

  loadProducts(): void {
    this.serviceProduct.getListProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.products.forEach(product => {
          product.lots = this.lots.filter(lot => lot.product_id === product.id);
        });
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  loadLots(): void {
    this.serviceLots.getListLots().subscribe({
      next: (data) => {
        this.lots = data;
        this.products.forEach(product => {
          product.lots = this.lots.filter(lot => lot.product_id === product.id);
        });
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error al obtener los lotes:', error);
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredProducts = [...this.products];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.product_code && p.product_code.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
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
    this.productToDelete = product;
    if (this.deleteConfirmationModal?.nativeElement) {
      this.deleteConfirmationModal.nativeElement.classList.add('show');
      this.deleteConfirmationModal.nativeElement.style.display = 'block';
    }
    document.body.classList.add('modal-open');
  }

  closeDeleteConfirmationModal() {
    if (this.deleteConfirmationModal?.nativeElement) {
      this.deleteConfirmationModal.nativeElement.classList.remove('show');
      this.deleteConfirmationModal.nativeElement.style.display = 'none';
    }
    document.body.classList.remove('modal-open');
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.serviceProduct.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.closeDeleteConfirmationModal();
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
          this.closeDeleteConfirmationModal();
        }
      });
    } else {
      this.closeDeleteConfirmationModal();
    }
  }

  deleteLot(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este lote?')) {
      this.serviceLots.deleteLot(id).subscribe({
        next: () => {
          this.loadLots();
        },
        error: (err) => console.error('Error al eliminar el lote:', err)
      });
    }
  }

  exportPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Farmacia Santa Rosita - Lista de Medicamentos', 14, 15);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 22);

    let y = 32;
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 14, y);
    doc.text('Nombre', 30, y);
    doc.text('Código', 90, y);
    doc.text('Precio Venta', 130, y);
    doc.text('Stock Total', 170, y);
    y += 4;
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    for (const p of this.products) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const totalQty = this.calculateTotalQuantity(p.lots || []);
      doc.text(this.formatProductId(p.id), 14, y);
      doc.text((p.name || '').substring(0, 28), 30, y);
      doc.text((p.product_code || '-').substring(0, 18), 90, y);
      doc.text(`Bs. ${(Number(p.selling_price) || 0).toFixed(2)}`, 130, y);
      doc.text(`${totalQty} uds.`, 170, y);
      y += 7;
    }

    doc.save('inventario-medicamentos.pdf');
  }
}