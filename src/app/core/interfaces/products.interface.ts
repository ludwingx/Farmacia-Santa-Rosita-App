import { IUsers } from "./users.interface";

// );
export interface IProductsList {
    id: number; //id product
    image: string; //image
    name: string; //nombre
    product_code: string; //codigo del producto
    description: string; //descripción
    price: number; //precio
    initial_stock: number; //stock inicial
    expiration_date: Date; //fecha de caducidad
    supplier: ISuplier; //referencia a la tabla de proveedores
    lot_number: string; //lote
    storage_location: string; //lugar de almacenamiento
    nutritional_information: string; //información nutricional
    notes: string; //notas
    category: ICategory; //referencia a la tabla de categorías
    current_stock: number; //stock actual
    created_at: Date; //fecha de creación
    updated_at: Date; //fecha de actualización
    user: IUsers;
    
}
export interface ICategory{
    id:number;
    name: string; 
}
export interface ISuplier{
    id: number;
    name: string;
}
export interface Iproduct {
    id: number; //id product
    image: string; //image
    name: string; //nombre
    product_code: string; //codigo del producto
    description: string; //descripción
    price: number; //precio
    initial_stock: number; //stock inicial
    expiration_date: Date; //fecha de caducidad
    supplier_id: number; //referencia a la tabla de proveedores
    lot_number: string; //lote
    storage_location_id: string; //lugar de almacenamiento
    nutritional_information: string; //información nutricional
    notes: string; //notas
    category_id: number; //referencia a la tabla de categorías
    current_stock: number; //stock actual
    created_at: Date; //fecha de creación
    updated_at: Date; //fecha de actualización

    
}