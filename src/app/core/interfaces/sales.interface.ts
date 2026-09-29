export interface ISaleItem {
    id?: number;
    sale_id?: number;
    product_id: number;
    lot_id?: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product?: {
        id: number;
        name: string;
        product_code?: string;
    };
}

export interface ISale {
    id?: number;
    user_id?: number;
    customer_name: string;
    customer_nit?: string;
    total_amount: number;
    payment_method: string;
    cash_received?: number;
    cash_change?: number;
    status?: string;
    date?: Date | string;
    items: ISaleItem[];
    user?: {
        id: number;
        name: string;
        username: string;
    };
}
