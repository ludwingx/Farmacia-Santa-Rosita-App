import { ILots } from "./lots";
import { IUsers } from "./users.interface";

// );
export interface IProductsList {
    id: number;
    image: string;
    name: string;
    product_code: string;
    description: string;
    purchase_price: number;
    selling_price: number;
    current_stock: number;
    initial_stock: number;
    supplier_id: number;
    nutritional_information: string;
    notes: string;
    create_at: Date;
    update_at: Date;
    create_by_user_id: number;
    last_update_by_user_id: number;
    status_id: number;
    supplier: ISuplier;
    category: ICategory;
    storage_location: IStorage_location;
    lots?: ILots[];
}
export interface ICategory{
    id:number;
    name: string;
    status_id: number;
}
export interface ISuplier{
    id: number;
    name: string;
    address: string;
    phone_number: string;
    email: string;
}
export interface IStorage_location{
    id: string;
    location: string;
    additional_info: string;
    status_id: number;
}