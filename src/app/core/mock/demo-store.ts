import { IProductsList } from '../interfaces/products.interface';
import { ILots } from '../interfaces/lots';
import { ISale } from '../interfaces/sales.interface';
import { IPurchase } from '../interfaces/purchases.interface';
import { IUsers } from '../interfaces/users.interface';
import { ISuppliers } from '../interfaces/suppliers.interface';
import { ICategories } from '../interfaces/categories.interface';
import { IDashboardSummary } from '../interfaces/reports.interface';

const DEMO_STORE_KEY = 'fsra_demo_store_data';

export class DemoStore {
  private static instance: DemoStore;

  public products: IProductsList[] = [];
  public lots: ILots[] = [];
  public sales: ISale[] = [];
  public purchases: IPurchase[] = [];
  public users: IUsers[] = [];
  public suppliers: ISuppliers[] = [];
  public categories: ICategories[] = [];
  public roles: any[] = [];
  public statuses: any[] = [];

  private constructor() {
    this.loadInitialData();
  }

  public static getInstance(): DemoStore {
    if (!DemoStore.instance) {
      DemoStore.instance = new DemoStore();
    }
    return DemoStore.instance;
  }

  private loadInitialData(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DEMO_STORE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.products = parsed.products || [];
          this.lots = parsed.lots || [];
          this.sales = parsed.sales || [];
          this.purchases = parsed.purchases || [];
          this.users = parsed.users || [];
          this.suppliers = parsed.suppliers || [];
          this.categories = parsed.categories || [];
          this.roles = parsed.roles || [];
          this.statuses = parsed.statuses || [];
          return;
        } catch (e) {
          console.error('Error al cargar datos de demo desde storage:', e);
        }
      }
    }
    this.seedDefaultData();
    this.persist();
  }

  public persist(): void {
    if (typeof window !== 'undefined') {
      try {
        const state = {
          products: this.products,
          lots: this.lots,
          sales: this.sales,
          purchases: this.purchases,
          users: this.users,
          suppliers: this.suppliers,
          categories: this.categories,
          roles: this.roles,
          statuses: this.statuses
        };
        localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Error persistiendo store de demo:', e);
      }
    }
  }

  public resetToDefault(): void {
    this.seedDefaultData();
    this.persist();
  }

  private seedDefaultData(): void {
    // 1. Roles
    this.roles = [
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Farmacéutico' },
      { id: 3, name: 'Cajero' }
    ];

    // 2. Statuses
    this.statuses = [
      { id: 1, name: 'Activo' },
      { id: 2, name: 'Inactivo' }
    ];

    // 3. Proveedores de Bolivia
    this.suppliers = [
      { id: 1, name: 'Droguería INTI S.A.', phone_number: '+591 2 2811122', email: 'contacto@inti.com.bo', address: 'Av. Juan Pablo II, La Paz, Bolivia' },
      { id: 2, name: 'Laboratorios Bagó de Bolivia', phone_number: '+591 2 2772020', email: 'ventas@bago.com.bo', address: 'Zona Sur, La Paz, Bolivia' },
      { id: 3, name: 'Laboratorios IFA S.A.', phone_number: '+591 3 3462211', email: 'info@ifa.com.bo', address: 'Parque Industrial, Santa Cruz, Bolivia' },
      { id: 4, name: 'Terbol S.A.', phone_number: '+591 3 3481000', email: 'pedidos@terbol.com.bo', address: 'Km 6 Doble Vía La Guardia, Santa Cruz' }
    ];

    // 4. Categorías Farmacéuticas
    this.categories = [
      { id: 1, name: 'Analgésicos y Antipiréticos', description: 'Alivio del dolor e inflamación y control de temperatura' },
      { id: 2, name: 'Antibióticos y Antimicrobianos', description: 'Tratamiento contra infecciones bacterianas' },
      { id: 3, name: 'Salud Cardiovascular', description: 'Control de hipertensión y ritmo cardiaco' },
      { id: 4, name: 'Gastrointestinales', description: 'Protectores gástricos, antiácidos y digestivos' },
      { id: 5, name: 'Vitaminas y Suplementos', description: 'Refuerzo inmunológico y nutricional' },
      { id: 6, name: 'Respiratorio y Antihistamínicos', description: 'Antigripales, broncodilatadores y antialérgicos' }
    ];

    // 5. Medicamentos con Lotes y Precios en Bolivianos (Bs.)
    this.products = [
      {
        id: 1,
        name: 'Paracetamol 500 mg',
        product_code: 'MED-001',
        description: 'Caja x 100 tabletas. Analgésico y antipirético de rápida acción.',
        purchase_price: 15.00,
        selling_price: 25.00,
        initial_stock: 120,
        current_stock: 95,
        category_id: 1,
        supplier_id: 1,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 2,
        name: 'Ibuprofeno 400 mg',
        product_code: 'MED-002',
        description: 'Caja x 30 cápsulas blandas. Antiinflamatorio no esteroideo.',
        purchase_price: 18.50,
        selling_price: 32.00,
        initial_stock: 80,
        current_stock: 45,
        category_id: 1,
        supplier_id: 2,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 3,
        name: 'Amoxicilina 500 mg',
        product_code: 'MED-003',
        description: 'Caja x 50 cápsulas. Antibiótico bactericida de amplio espectro.',
        purchase_price: 28.00,
        selling_price: 45.00,
        initial_stock: 60,
        current_stock: 18,
        category_id: 2,
        supplier_id: 1,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 4,
        name: 'Omeprazol 20 mg',
        product_code: 'MED-004',
        description: 'Frasco x 28 cápsulas con microgránulos gastrorresistentes.',
        purchase_price: 22.00,
        selling_price: 38.00,
        initial_stock: 50,
        current_stock: 8, // Stock crítico
        category_id: 4,
        supplier_id: 3,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 5,
        name: 'Losartán Potásico 50 mg',
        product_code: 'MED-005',
        description: 'Caja x 30 comprimidos recubiertos para hipertensión arterial.',
        purchase_price: 30.00,
        selling_price: 52.00,
        initial_stock: 70,
        current_stock: 35,
        category_id: 3,
        supplier_id: 2,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 6,
        name: 'Azitromicina 500 mg',
        product_code: 'MED-006',
        description: 'Caja x 3 comprimidos. Macrólido para vías respiratorias.',
        purchase_price: 20.00,
        selling_price: 35.00,
        initial_stock: 40,
        current_stock: 6, // Stock crítico
        category_id: 2,
        supplier_id: 1,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 7,
        name: 'Metformina 850 mg',
        product_code: 'MED-007',
        description: 'Caja x 60 tabletas para control de glucosa y diabetes tipo 2.',
        purchase_price: 25.00,
        selling_price: 42.00,
        initial_stock: 90,
        current_stock: 60,
        category_id: 3,
        supplier_id: 4,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 8,
        name: 'Vitamina C 1g Efervescente',
        product_code: 'MED-008',
        description: 'Tubo x 10 tabletas efervescentes sabor naranja. Refuerzo inmune.',
        purchase_price: 14.00,
        selling_price: 24.50,
        initial_stock: 100,
        current_stock: 82,
        category_id: 5,
        supplier_id: 1,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 9,
        name: 'Salbutamol Inhalador 100 mcg',
        product_code: 'MED-009',
        description: 'Aerosol x 200 dosis con espaciador. Broncodilatador para asma.',
        purchase_price: 35.00,
        selling_price: 58.00,
        initial_stock: 30,
        current_stock: 5, // Stock crítico
        category_id: 6,
        supplier_id: 3,
        image: 'assets/img/logo.png',
        status_id: 1
      },
      {
        id: 10,
        name: 'Loratadina 10 mg',
        product_code: 'MED-010',
        description: 'Caja x 20 comprimidos. Antialérgico de segunda generación sin sedación.',
        purchase_price: 8.00,
        selling_price: 16.00,
        initial_stock: 60,
        current_stock: 48,
        category_id: 6,
        supplier_id: 2,
        image: 'assets/img/logo.png',
        status_id: 1
      }
    ];

    // Fechas dinámicas para pruebas de caducidad en el semáforo
    const today = new Date();
    const in20Days = new Date();
    in20Days.setDate(today.getDate() + 20);
    const in60Days = new Date();
    in60Days.setDate(today.getDate() + 60);
    const in180Days = new Date();
    in180Days.setDate(today.getDate() + 180);
    const in365Days = new Date();
    in365Days.setDate(today.getDate() + 365);

    // 6. Lotes asociados
    this.lots = [
      { id: 101, product_id: 1, lot_number: 'L-2024-01A', quantity: 50, initial_quantity: 60, expiration_date: in180Days.toISOString().split('T')[0] as any },
      { id: 102, product_id: 1, lot_number: 'L-2024-01B', quantity: 45, initial_quantity: 60, expiration_date: in365Days.toISOString().split('T')[0] as any },
      { id: 103, product_id: 2, lot_number: 'L-2024-02A', quantity: 45, initial_quantity: 80, expiration_date: in365Days.toISOString().split('T')[0] as any },
      { id: 104, product_id: 3, lot_number: 'L-2024-03A', quantity: 18, initial_quantity: 60, expiration_date: in20Days.toISOString().split('T')[0] as any }, // Vencimiento cercano (< 30d)
      { id: 105, product_id: 4, lot_number: 'L-2024-04A', quantity: 8, initial_quantity: 50, expiration_date: in60Days.toISOString().split('T')[0] as any }, // Vencimiento mediano (< 90d)
      { id: 106, product_id: 5, lot_number: 'L-2024-05A', quantity: 35, initial_quantity: 70, expiration_date: in365Days.toISOString().split('T')[0] as any },
      { id: 107, product_id: 6, lot_number: 'L-2024-06A', quantity: 6, initial_quantity: 40, expiration_date: in20Days.toISOString().split('T')[0] as any }, // Vencimiento cercano (< 30d)
      { id: 108, product_id: 7, lot_number: 'L-2024-07A', quantity: 60, initial_quantity: 90, expiration_date: in365Days.toISOString().split('T')[0] as any },
      { id: 109, product_id: 8, lot_number: 'L-2024-08A', quantity: 82, initial_quantity: 100, expiration_date: in365Days.toISOString().split('T')[0] as any },
      { id: 110, product_id: 9, lot_number: 'L-2024-09A', quantity: 5, initial_quantity: 30, expiration_date: in180Days.toISOString().split('T')[0] as any },
      { id: 111, product_id: 10, lot_number: 'L-2024-10A', quantity: 48, initial_quantity: 60, expiration_date: in365Days.toISOString().split('T')[0] as any }
    ];

    // Asociar lotes a productos
    this.products.forEach(p => {
      p.lots = this.lots.filter(l => l.product_id === p.id);
      const totalQty = p.lots.reduce((acc, l) => acc + (l.quantity || 0), 0);
      p.current_stock = totalQty > 0 ? totalQty : p.current_stock;
    });

    // 7. Usuarios del Sistema
    this.users = [
      {
        id: 1,
        username: 'admin',
        ci: 8845129,
        name: 'Dra. Rosita Meneses',
        email: 'rosita@farmaciasantarosita.com',
        password: '',
        image: '',
        status_id: 1,
        role_id: 1,
        status: { id: 1, name: 'Activo' },
        role: { id: 1, name: 'Administrador' }
      },
      {
        id: 2,
        username: 'farmaceutico',
        ci: 7654321,
        name: 'Lic. Carlos Torrico',
        email: 'carlos.t@farmaciasantarosita.com',
        password: '',
        image: '',
        status_id: 1,
        role_id: 2,
        status: { id: 1, name: 'Activo' },
        role: { id: 2, name: 'Farmacéutico' }
      },
      {
        id: 3,
        username: 'cajero1',
        ci: 9012345,
        name: 'María Fernández',
        email: 'maria.f@farmaciasantarosita.com',
        password: '',
        image: '',
        status_id: 1,
        role_id: 3,
        status: { id: 1, name: 'Activo' },
        role: { id: 3, name: 'Cajero' }
      }
    ];

    // 8. Historial de Ventas inicial
    this.sales = [
      {
        id: 1001,
        customer_name: 'Juan Pérez Ramos',
        customer_nit: '4512879015',
        total_amount: 82.00,
        payment_method: 'Efectivo',
        cash_received: 100.00,
        cash_change: 18.00,
        status: 'Completada',
        date: new Date(Date.now() - 3600000 * 3),
        user: { id: 1, name: 'Dra. Rosita Meneses', username: 'admin' },
        items: [
          { product_id: 1, quantity: 2, unit_price: 25.00, subtotal: 50.00, product: { id: 1, name: 'Paracetamol 500 mg' } },
          { product_id: 2, quantity: 1, unit_price: 32.00, subtotal: 32.00, product: { id: 2, name: 'Ibuprofeno 400 mg' } }
        ]
      },
      {
        id: 1002,
        customer_name: 'Silvia Flores Vaca',
        customer_nit: '7823901021',
        total_amount: 45.00,
        payment_method: 'QR',
        cash_received: 45.00,
        cash_change: 0.00,
        status: 'Completada',
        date: new Date(Date.now() - 3600000 * 1),
        user: { id: 2, name: 'Lic. Carlos Torrico', username: 'farmaceutico' },
        items: [
          { product_id: 3, quantity: 1, unit_price: 45.00, subtotal: 45.00, product: { id: 3, name: 'Amoxicilina 500 mg' } }
        ]
      }
    ];

    // 9. Compras a Proveedores iniciales
    this.purchases = [
      {
        id: 501,
        invoice_number: 'FAC-INTI-8841',
        supplier_id: 1,
        total_amount: 1800.00,
        notes: 'Pedido mensual de analgésicos y antibióticos',
        date: new Date(Date.now() - 86400000 * 4),
        supplier: { id: 1, name: 'Droguería INTI S.A.' },
        items: [
          { product_id: 1, lot_number: 'L-2024-01B', quantity: 60, purchase_price: 15.00, subtotal: 900.00, product: { id: 1, name: 'Paracetamol 500 mg' } },
          { product_id: 3, lot_number: 'L-2024-03A', quantity: 30, purchase_price: 28.00, subtotal: 840.00, product: { id: 3, name: 'Amoxicilina 500 mg' } }
        ]
      },
      {
        id: 502,
        invoice_number: 'FAC-BAGO-3109',
        supplier_id: 2,
        total_amount: 1480.00,
        notes: 'Ingreso urgente de antiinflamatorios',
        date: new Date(Date.now() - 86400000 * 2),
        supplier: { id: 2, name: 'Laboratorios Bagó de Bolivia' },
        items: [
          { product_id: 2, lot_number: 'L-2024-02A', quantity: 80, purchase_price: 18.50, subtotal: 1480.00, product: { id: 2, name: 'Ibuprofeno 400 mg' } }
        ]
      }
    ];
  }

  // Métodos auxiliares para Dashboard y Reportes
  public getDashboardSummary(): IDashboardSummary {
    const today = new Date().toDateString();
    const todaySales = this.sales.filter(s => s.date && new Date(s.date).toDateString() === today && s.status !== 'Anulada');
    const todaySalesTotal = todaySales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);

    const expiringProducts: any[] = [];
    const now = new Date();

    this.products.forEach(p => {
      const lots = this.lots.filter(l => l.product_id === p.id);
      lots.forEach(lot => {
        if (lot.expiration_date) {
          const exp = new Date(lot.expiration_date);
          const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));
          if (diffDays <= 90) {
            expiringProducts.push({
              ...p,
              expiration_date: lot.expiration_date,
              lot_number: lot.lot_number,
              days_left: diffDays,
              supplier: this.suppliers.find(s => s.id === p.supplier_id)
            });
          }
        }
      });
    });

    const criticalProducts = this.products.filter(p => (p.current_stock ?? 0) <= 10);

    return {
      todaySalesTotal,
      todaySalesCount: todaySales.length,
      totalProducts: this.products.length,
      expiringCount: expiringProducts.length,
      criticalStockCount: criticalProducts.length,
      expiringProducts
    };
  }

  public getCriticalStock(): IProductsList[] {
    return this.products
      .filter(p => (p.current_stock ?? 0) <= 10)
      .map(p => ({
        ...p,
        category: this.categories.find(c => c.id === p.category_id),
        supplier: this.suppliers.find(s => s.id === p.supplier_id)
      }));
  }
}
