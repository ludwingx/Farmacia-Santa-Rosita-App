import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductsApiService } from '../../../core/services/products/products-api.service';
import { SalesApiService } from '../../../core/services/sales/sales-api.service';
import { IProductsList } from '../../../core/interfaces/products.interface';
import { ISale, ISaleItem } from '../../../core/interfaces/sales.interface';

interface CartItem {
  product: IProductsList;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit {
  activeTab: 'pos' | 'history' = 'pos';

  products: IProductsList[] = [];
  filteredProducts: IProductsList[] = [];
  searchTerm: string = '';

  cart: CartItem[] = [];
  customerName: string = 'Cliente General';
  customerNit: string = '';
  paymentMethod: string = 'Efectivo';
  cashReceived: number = 0;

  salesHistory: ISale[] = [];
  selectedSale: ISale | null = null;
  loadingProducts: boolean = false;
  loadingHistory: boolean = false;
  isProcessing: boolean = false;

  constructor(
    private productsService: ProductsApiService,
    private salesService: SalesApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadHistory();
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productsService.getListProducts().subscribe({
      next: (data) => {
        this.products = data || [];
        this.filteredProducts = [...this.products];
        this.loadingProducts = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.toastr.error('Error al cargar el inventario de medicamentos');
        this.loadingProducts = false;
      }
    });
  }

  loadHistory(): void {
    this.loadingHistory = true;
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.salesHistory = data || [];
        this.loadingHistory = false;
      },
      error: (err) => {
        console.error('Error al cargar historial de ventas:', err);
        this.loadingHistory = false;
      }
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.filteredProducts = this.products.filter((p) =>
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.product_code && p.product_code.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }

  addToCart(prod: IProductsList): void {
    const availableStock = prod.current_stock ?? 0;
    if (availableStock <= 0) {
      this.toastr.warning(`El producto ${prod.name} no tiene stock disponible`);
      return;
    }

    const existingIndex = this.cart.findIndex((i) => i.product.id === prod.id);
    if (existingIndex > -1) {
      const currentQty = this.cart[existingIndex].quantity;
      if (currentQty + 1 > availableStock) {
        this.toastr.warning(`Stock máximo alcanzado para ${prod.name} (${availableStock} disponibles)`);
        return;
      }
      this.cart[existingIndex].quantity += 1;
      this.cart[existingIndex].subtotal =
        this.cart[existingIndex].quantity * this.cart[existingIndex].unit_price;
    } else {
      const price = Number(prod.selling_price) || 0;
      this.cart.push({
        product: prod,
        quantity: 1,
        unit_price: price,
        subtotal: price
      });
    }

    this.toastr.success(`Agregado: ${prod.name}`, 'POS Farmacia', { timeOut: 1500 });
  }

  updateQuantity(item: CartItem, delta: number): void {
    const availableStock = item.product.current_stock ?? 0;
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      this.removeFromCart(item);
      return;
    }

    if (newQty > availableStock) {
      this.toastr.warning(`No hay suficiente stock. Disponible: ${availableStock}`);
      return;
    }

    item.quantity = newQty;
    item.subtotal = item.quantity * item.unit_price;
  }

  removeFromCart(item: CartItem): void {
    const index = this.cart.indexOf(item);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
  }

  clearCart(): void {
    if (this.cart.length === 0) return;
    this.cart = [];
    this.cashReceived = 0;
    this.toastr.info('Carrito de mostrador vaciado');
  }

  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + item.subtotal, 0);
  }

  setExactCash(): void {
    this.cashReceived = this.getTotal();
  }

  addCash(amount: number): void {
    this.cashReceived = (Number(this.cashReceived) || 0) + amount;
  }

  getChange(): number {
    if (this.paymentMethod !== 'Efectivo') return 0;
    const total = this.getTotal();
    const received = Number(this.cashReceived) || 0;
    return received > total ? received - total : 0;
  }

  processSale(): void {
    if (this.cart.length === 0) {
      this.toastr.warning('El carrito de venta está vacío');
      return;
    }

    const total = this.getTotal();
    if (this.paymentMethod === 'Efectivo' && (Number(this.cashReceived) || 0) < total) {
      this.toastr.error('El monto recibido en efectivo es menor al total de la venta');
      return;
    }

    this.isProcessing = true;

    const salePayload: ISale = {
      customer_name: this.customerName || 'Cliente General',
      customer_nit: this.customerNit || '',
      total_amount: total,
      payment_method: this.paymentMethod,
      cash_received: this.paymentMethod === 'Efectivo' ? Number(this.cashReceived) : total,
      cash_change: this.getChange(),
      items: this.cart.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        unit_price: i.unit_price,
        subtotal: i.subtotal
      }))
    };

    this.salesService.createSale(salePayload).subscribe({
      next: (res) => {
        this.toastr.success('¡Venta realizada con éxito!', 'Venta #' + (res.sale_id || ''));
        // Guardar para modal de ticket
        this.selectedSale = {
          ...salePayload,
          id: res.sale_id,
          date: new Date()
        };

        // Limpiar estado
        this.clearCart();
        this.customerName = 'Cliente General';
        this.customerNit = '';
        this.cashReceived = 0;
        this.isProcessing = false;

        // Recargar datos
        this.loadProducts();
        this.loadHistory();
      },
      error: (err) => {
        console.error('Error al registrar venta:', err);
        const msg = err.error?.msg || 'Error al procesar la venta';
        this.toastr.error(msg, 'Error');
        this.isProcessing = false;
      }
    });
  }

  viewSaleDetail(sale: ISale): void {
    this.selectedSale = sale;
  }

  closeReceiptModal(): void {
    this.selectedSale = null;
  }

  printReceipt(): void {
    window.print();
  }

  cancelSale(saleId: number | undefined): void {
    if (!saleId) return;
    if (!confirm('¿Está seguro de anular esta venta? El stock será devuelto al inventario.')) {
      return;
    }

    this.salesService.cancelSale(saleId).subscribe({
      next: () => {
        this.toastr.success('Venta anulada correctamente');
        this.loadProducts();
        this.loadHistory();
      },
      error: (err) => {
        console.error('Error al anular venta:', err);
        this.toastr.error('Error al anular la venta');
      }
    });
  }
}
