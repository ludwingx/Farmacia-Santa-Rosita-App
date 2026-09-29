import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PurchasesApiService } from '../../../core/services/purchases/purchases-api.service';
import { ProductsApiService } from '../../../core/services/products/products-api.service';
import { SuppliersService } from '../../../core/services/suppliers/suppliers.service';
import { ISuppliers } from '../../../core/interfaces/suppliers.interface';
import { IProductsList } from '../../../core/interfaces/products.interface';
import { IPurchase, IPurchaseItem } from '../../../core/interfaces/purchases.interface';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {
  activeTab: 'new' | 'history' = 'new';

  suppliers: ISuppliers[] = [];
  products: IProductsList[] = [];
  purchasesList: IPurchase[] = [];

  // Formulario cabecera
  supplierId: number | null = null;
  invoiceNumber: string = '';
  notes: string = '';

  // Formulario item actual
  selectedProductId: number | null = null;
  itemLot: string = '';
  itemExpiration: string = '';
  itemQuantity: number = 1;
  itemPrice: number = 0;

  // Lista de items a registrar
  items: IPurchaseItem[] = [];

  selectedPurchase: IPurchase | null = null;
  isSubmitting: boolean = false;
  loadingHistory: boolean = false;

  constructor(
    private purchasesService: PurchasesApiService,
    private productsService: ProductsApiService,
    private suppliersService: SuppliersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();
    this.loadPurchases();
  }

  loadSuppliers(): void {
    this.suppliersService.getSuppliers().subscribe({
      next: (data) => (this.suppliers = data || []),
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  loadProducts(): void {
    this.productsService.getListProducts().subscribe({
      next: (data) => (this.products = data || []),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  loadPurchases(): void {
    this.loadingHistory = true;
    this.purchasesService.getPurchases().subscribe({
      next: (data) => {
        this.purchasesList = data || [];
        this.loadingHistory = false;
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
        this.loadingHistory = false;
      }
    });
  }

  onProductSelect(): void {
    if (!this.selectedProductId) return;
    const prod = this.products.find((p) => p.id === Number(this.selectedProductId));
    if (prod) {
      this.itemPrice = Number(prod.purchase_price) || 0;
    }
  }

  addItem(): void {
    if (!this.selectedProductId) {
      this.toastr.warning('Seleccione un medicamento');
      return;
    }
    if (this.itemQuantity <= 0) {
      this.toastr.warning('La cantidad debe ser mayor a 0');
      return;
    }
    if (this.itemPrice < 0) {
      this.toastr.warning('El costo unitario no puede ser negativo');
      return;
    }

    const prod = this.products.find((p) => p.id === Number(this.selectedProductId));
    if (!prod) return;

    const subtotal = this.itemQuantity * this.itemPrice;

    this.items.push({
      product_id: prod.id,
      lot_number: this.itemLot || '',
      expiration_date: this.itemExpiration || undefined,
      quantity: this.itemQuantity,
      purchase_price: this.itemPrice,
      subtotal,
      product: {
        id: prod.id,
        name: prod.name,
        product_code: prod.product_code
      }
    });

    // Resetear formulario de ítem
    this.selectedProductId = null;
    this.itemLot = '';
    this.itemExpiration = '';
    this.itemQuantity = 1;
    this.itemPrice = 0;
    this.toastr.success('Medicamento añadido al detalle de compra');
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + item.subtotal, 0);
  }

  savePurchase(): void {
    if (!this.supplierId) {
      this.toastr.warning('Seleccione un proveedor / laboratorio');
      return;
    }
    if (this.items.length === 0) {
      this.toastr.warning('Agregue al menos un producto a la compra');
      return;
    }

    this.isSubmitting = true;
    const payload: IPurchase = {
      supplier_id: Number(this.supplierId),
      invoice_number: this.invoiceNumber,
      total_amount: this.getTotal(),
      notes: this.notes,
      items: this.items
    };

    this.purchasesService.createPurchase(payload).subscribe({
      next: () => {
        this.toastr.success('¡Compra registrada y stock actualizado con éxito!');
        this.items = [];
        this.supplierId = null;
        this.invoiceNumber = '';
        this.notes = '';
        this.isSubmitting = false;
        this.loadProducts();
        this.loadPurchases();
        this.activeTab = 'history';
      },
      error: (err) => {
        console.error('Error al guardar compra:', err);
        this.toastr.error('Error al registrar la compra');
        this.isSubmitting = false;
      }
    });
  }

  viewDetail(purchase: IPurchase): void {
    this.selectedPurchase = purchase;
  }

  closeDetailModal(): void {
    this.selectedPurchase = null;
  }
}
