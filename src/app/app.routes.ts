import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/modules/dashboard/dashboard.component';
import { InventoryComponent } from './shared/modules/inventory/inventory.component';
import { ReportsComponent } from './shared/modules/reports/reports.component';
import { SalesComponent } from './shared/modules/sales/sales.component';

import { EditProductComponent } from './shared/modules/inventory/products/edit-product/edit-product.component';
import { NewProductComponent } from './shared/modules/inventory/products/new-product/new-product.component';
export const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent },
    {path: 'inventory', component: InventoryComponent },
    {path: 'reports', component: ReportsComponent },
    {path: 'sales', component: SalesComponent},
    { path: 'inventory/products/edit-product/:id', component: EditProductComponent },
    {path: 'inventory/products/new-product', component: NewProductComponent}
];
