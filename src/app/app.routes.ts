import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/modules/dashboard/dashboard.component';
import { InventoryComponent } from './shared/modules/inventory/inventory.component';
import { ReportsComponent } from './shared/modules/reports/reports.component';
import { SalesComponent } from './shared/modules/sales/sales.component';

import { EditProductComponent } from './shared/modules/inventory/products/edit-product/edit-product.component';
import { NewProductComponent } from './shared/modules/inventory/products/new-product/new-product.component';
import { UsersComponent } from './shared/modules/users/users.component';
import { NewUserComponent } from './shared/modules/users/new-user/new-user.component';
import { EditUserComponent } from './shared/modules/users/edit-user/edit-user.component';
import { authGuardGuard } from './core/guards/auth-guard.guard';
import { LoginComponent } from './shared/modules/auth/login/login.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

export const routes: Routes = [

    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuardGuard]},
    {path: 'reports', component: ReportsComponent,  },
    {path: 'sales', component: SalesComponent,  },
    {path: 'inventory', component: InventoryComponent,  },
    {path: 'inventory/products/edit-product/:id', component: EditProductComponent,  },
    {path: 'inventory/products/new-product', component: NewProductComponent,  },

    {path: 'users', component: UsersComponent,  },
    {path: 'users/new-user', component: NewUserComponent},
    {path: 'users/edit-user/:id', component: EditUserComponent},

    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: 'login', pathMatch: 'full'},
    { path: '', redirectTo: '/login', pathMatch: 'full' }
]