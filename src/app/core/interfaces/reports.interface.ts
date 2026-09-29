import { IProductsList } from './products.interface';

export interface IDashboardSummary {
    totalProducts: number;
    todaySalesCount: number;
    todaySalesTotal: number;
    criticalStockCount: number;
    expiringCount: number;
    expiringProducts: IProductsList[];
}
