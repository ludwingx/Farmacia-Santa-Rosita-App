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
import { ProfileComponent } from './shared/modules/profile/profile.component';

export const routes: Routes = [

    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuardGuard]},
    {path: 'reports', component: ReportsComponent, canActivate: [authGuardGuard]  },
    {path: 'sales', component: SalesComponent, canActivate: [authGuardGuard]  },
    {path: 'inventory', component: InventoryComponent, canActivate: [authGuardGuard]  },
    {path: 'inventory/products/edit-product/:id', component: EditProductComponent, canActivate: [authGuardGuard]  },
    {path: 'inventory/products/new-product', component: NewProductComponent, canActivate: [authGuardGuard]  },

    {path: 'profile', component: ProfileComponent, canActivate: [authGuardGuard]},
    {path: 'users', component: UsersComponent, canActivate: [authGuardGuard]  },
    {path: 'users/new-user', component: NewUserComponent, canActivate: [authGuardGuard]},
    {path: 'users/edit-user/:id', component: EditUserComponent, canActivate: [authGuardGuard]},

    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: 'login', pathMatch: 'full'},
    { path: '', redirectTo: '/login', pathMatch: 'full' }
]