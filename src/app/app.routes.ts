import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/modules/dashboard/dashboard.component';
import { InventoryComponent } from './shared/modules/inventory/inventory.component';
import { ReportsComponent } from './shared/modules/reports/reports.component';
import { SalesComponent } from './shared/modules/sales/sales.component';

import { EditProductComponent } from './shared/modules/inventory/products/edit-product/edit-product.component';
import { NewProductComponent } from './shared/modules/inventory/products/new-product/new-product.component';
import { UsersComponent } from './shared/modules/users/users.component';
import { NewUserComponent } from './shared/modules/users/new-user/new-user.component';
export const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent },
    {path: 'reports', component: ReportsComponent },
    {path: 'sales', component: SalesComponent},

    {path: 'inventory', component: InventoryComponent },
    {path: 'inventory/products/edit-product/:id', component: EditProductComponent },
    {path: 'inventory/products/new-product', component: NewProductComponent},

    {path: 'users', component: UsersComponent},
    {path: 'users/new-user', component: NewUserComponent}

];
