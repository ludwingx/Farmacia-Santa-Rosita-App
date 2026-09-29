import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DemoStore } from '../mock/demo-store';

export const demoDataInterceptor: HttpInterceptorFn = (req, next) => {
  const store = DemoStore.getInstance();
  const isDemo = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/demo') || 
     localStorage.getItem('isDemoMode') === 'true' ||
     (localStorage.getItem('token') && localStorage.getItem('token')!.includes('demo')));

  // Handler para responder con mock data segun la URL solicitada
  const handleMockRequest = (request: typeof req) => {
    const url = request.url;
    const method = request.method;

    // 1. PRODUCTOS
    if (url.includes('/api/productos')) {
      if (method === 'GET') {
        const idMatch = url.match(/\/api\/productos\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          const prod = store.products.find(p => p.id === id);
          return of(new HttpResponse({ status: 200, body: prod }));
        }
        return of(new HttpResponse({ status: 200, body: store.products }));
      }
      if (method === 'POST') {
        const body = request.body as any;
        const newId = store.products.length > 0 ? Math.max(...store.products.map(p => p.id)) + 1 : 1;
        const newProd = { ...body, id: newId, current_stock: body.initial_stock || 0 };
        store.products.push(newProd);
        store.persist();
        return of(new HttpResponse({ status: 201, body: newProd }));
      }
      if (method === 'PUT') {
        const idMatch = url.match(/\/api\/productos\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          const idx = store.products.findIndex(p => p.id === id);
          if (idx > -1) {
            const body = (request.body || {}) as any;
            store.products[idx] = { ...store.products[idx], ...body };
            store.persist();
          }
        }
        return of(new HttpResponse({ status: 200, body: { msg: 'Producto actualizado' } }));
      }
      if (method === 'DELETE') {
        const idMatch = url.match(/\/api\/productos\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          store.products = store.products.filter(p => p.id !== id);
          store.persist();
        }
        return of(new HttpResponse({ status: 200, body: { msg: 'Producto eliminado' } }));
      }
    }

    // 2. LOTES
    if (url.includes('/api/lots')) {
      if (method === 'GET') {
        return of(new HttpResponse({ status: 200, body: store.lots }));
      }
      if (method === 'POST') {
        const body = request.body as any;
        const newId = store.lots.length > 0 ? Math.max(...store.lots.map(l => l.id)) + 1 : 101;
        const newLot = { ...body, id: newId };
        store.lots.push(newLot);
        // actualizar stock del producto
        const prod = store.products.find(p => p.id === body.product_id);
        if (prod) {
          prod.current_stock = (prod.current_stock || 0) + Number(body.quantity || 0);
        }
        store.persist();
        return of(new HttpResponse({ status: 201, body: newLot }));
      }
      if (method === 'DELETE') {
        const idMatch = url.match(/\/api\/lots\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          store.lots = store.lots.filter(l => l.id !== id);
          store.persist();
        }
        return of(new HttpResponse({ status: 200, body: { msg: 'Lote eliminado' } }));
      }
    }

    // 3. VENTAS (POS)
    if (url.includes('/api/sales')) {
      if (url.includes('/cancel/') && method === 'PUT') {
        const idMatch = url.match(/\/cancel\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          const sale = store.sales.find(s => s.id === id);
          if (sale) {
            sale.status = 'Anulada';
            store.persist();
          }
        }
        return of(new HttpResponse({ status: 200, body: { msg: 'Venta anulada con éxito' } }));
      }
      if (method === 'GET') {
        const idMatch = url.match(/\/api\/sales\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          const sale = store.sales.find(s => s.id === id);
          return of(new HttpResponse({ status: 200, body: sale }));
        }
        return of(new HttpResponse({ status: 200, body: store.sales }));
      }
      if (method === 'POST') {
        const body = request.body as any;
        const newId = store.sales.length > 0 ? Math.max(...store.sales.map(s => s.id || 0)) + 1 : 1001;
        const newSale = {
          ...body,
          id: newId,
          date: new Date(),
          status: 'Completada',
          user: { name: 'Administrador Demo', username: 'admin' }
        };
        // Reducir stock de los productos vendidos
        if (body.items && Array.isArray(body.items)) {
          body.items.forEach((item: any) => {
            const prod = store.products.find(p => p.id === item.product_id);
            if (prod) {
              prod.current_stock = Math.max(0, (prod.current_stock || 0) - item.quantity);
            }
          });
        }
        store.sales.unshift(newSale);
        store.persist();
        return of(new HttpResponse({ status: 201, body: { msg: 'Venta registrada con éxito', sale_id: newId } }));
      }
    }

    // 4. COMPRAS A PROVEEDORES
    if (url.includes('/api/purchases')) {
      if (method === 'GET') {
        return of(new HttpResponse({ status: 200, body: store.purchases }));
      }
      if (method === 'POST') {
        const body = request.body as any;
        const newId = store.purchases.length > 0 ? Math.max(...store.purchases.map(p => p.id || 0)) + 1 : 501;
        const supplier = store.suppliers.find(s => s.id === body.supplier_id);
        const newPurchase = {
          ...body,
          id: newId,
          date: new Date(),
          supplier: supplier || { id: body.supplier_id, name: 'Proveedor Farmacéutico' }
        };
        // Aumentar stock e ingresar lotes si vienen
        if (body.items && Array.isArray(body.items)) {
          body.items.forEach((item: any) => {
            const prod = store.products.find(p => p.id === item.product_id);
            if (prod) {
              prod.current_stock = (prod.current_stock || 0) + Number(item.quantity || 0);
            }
            if (item.lot_number) {
              const lotId = store.lots.length > 0 ? Math.max(...store.lots.map(l => l.id)) + 1 : 101;
              store.lots.push({
                id: lotId,
                product_id: item.product_id,
                lot_number: item.lot_number,
                quantity: item.quantity,
                initial_quantity: item.quantity,
                expiration_date: item.expiration_date || new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0] as any
              });
            }
          });
        }
        store.purchases.unshift(newPurchase);
        store.persist();
        return of(new HttpResponse({ status: 201, body: { msg: 'Compra registrada con éxito', purchase_id: newId } }));
      }
    }

    // 5. REPORTES Y DASHBOARD
    if (url.includes('/api/reports/dashboard')) {
      return of(new HttpResponse({ status: 200, body: store.getDashboardSummary() }));
    }
    if (url.includes('/api/reports/critical-stock')) {
      return of(new HttpResponse({ status: 200, body: store.getCriticalStock() }));
    }

    // 6. USUARIOS
    if (url.includes('/api/users')) {
      if (url.includes('/status') && method === 'PUT') {
        const idMatch = url.match(/\/api\/users\/(\d+)\/status/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          const user = store.users.find(u => u.id === id);
          if (user) {
            const body = (request.body || {}) as any;
            user.status_id = body?.status_id || 1;
            user.status = user.status_id === 1 ? { id: 1, name: 'Activo' } : { id: 2, name: 'Inactivo' };
            store.persist();
          }
        }
        return of(new HttpResponse({ status: 200, body: { msg: 'Estado de usuario actualizado' } }));
      }
      if (method === 'GET') {
        const idMatch = url.match(/\/api\/users\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          const user = store.users.find(u => u.id === id);
          return of(new HttpResponse({ status: 200, body: user }));
        }
        return of(new HttpResponse({ status: 200, body: store.users }));
      }
      if (method === 'POST') {
        const body = request.body as any;
        const newId = store.users.length > 0 ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
        const role = store.roles.find(r => r.id === Number(body.role_id)) || { id: 1, name: 'Administrador' };
        const newUser = {
          ...body,
          id: newId,
          role_id: Number(body.role_id) || 1,
          status_id: 1,
          role,
          status: { id: 1, name: 'Activo' }
        };
        store.users.push(newUser);
        store.persist();
        return of(new HttpResponse({ status: 201, body: newUser }));
      }
      if (method === 'PUT') {
        const idMatch = url.match(/\/api\/users\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          const idx = store.users.findIndex(u => u.id === id);
          if (idx > -1) {
            const body = (request.body || {}) as any;
            store.users[idx] = { ...store.users[idx], ...body };
            store.persist();
          }
        }
        return of(new HttpResponse({ status: 200, body: { msg: 'Usuario actualizado' } }));
      }
    }

    // 7. ROLES, STATUSES, PROVEEDORES, CATEGORIAS
    if (url.includes('/api/roles')) {
      return of(new HttpResponse({ status: 200, body: store.roles }));
    }
    if (url.includes('/api/statuses')) {
      return of(new HttpResponse({ status: 200, body: store.statuses }));
    }
    if (url.includes('/api/suppliers')) {
      return of(new HttpResponse({ status: 200, body: store.suppliers }));
    }
    if (url.includes('/api/categories')) {
      return of(new HttpResponse({ status: 200, body: store.categories }));
    }

    // Default 200 OK
    return of(new HttpResponse({ status: 200, body: { msg: 'OK (Mock Demo)' } }));
  };

  // Si esta en modo demo explicitamente, responder directamente con mock data
  if (isDemo && req.url.includes('/api/')) {
    return handleMockRequest(req);
  }

  // De lo contrario, intentar solicitud real y usar mock data si el backend esta caido / offline
  return next(req).pipe(
    catchError((error) => {
      // Si el backend no responde (status 0) o da error 500, recurrir a los datos de demo para no romper la app
      if (error.status === 0 || error.status >= 500) {
        console.warn(`[Demo Interceptor] Backend no disponible (${error.status}). Utilizando datos de contingencia.`);
        return handleMockRequest(req);
      }
      return throwError(() => error);
    })
  );
};
