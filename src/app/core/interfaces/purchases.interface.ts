export interface IPurchaseItem {
    id?: number;
    purchase_id?: number;
    product_id: number;
    lot_number?: string;
    expiration_date?: Date | string;
    quantity: number;
    purchase_price: number;
    subtotal: number;
    product?: {
        id: number;
        name: string;
        product_code?: string;
    };
}

export interface IPurchase {
    id?: number;
    supplier_id: number;
    user_id?: number;
    invoice_number?: string;
    total_amount: number;
    date?: Date | string;
    notes?: string;
    items: IPurchaseItem[];
    supplier?: {
        id: number;
        name: string;
        phone_number?: string;
    };
    user?: {
        id: number;
        name: string;
        username: string;
    };
}
