import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/modules/dashboard/dashboard.component';
import { InventoryComponent } from './shared/modules/inventory/inventory.component';
import { ReportsComponent } from './shared/modules/reports/reports.component';
import { SalesComponent } from './shared/modules/sales/sales.component';

export const routes: Routes = [

    {path: 'dashboard', component: DashboardComponent },
    {path: 'inventory', component: InventoryComponent },
    {path: 'reports', component: ReportsComponent },
    {path: 'sales', component: SalesComponent}
];
