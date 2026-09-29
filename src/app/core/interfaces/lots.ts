export interface ILots {
    id : number;
    lot_number?: string;
    product_id : number;
    quantity : number;  //se pide unidades del lote que se ingresara
    initial_quantity : number; 
    expiration_date : Date | string; //se pide fecha de vencimiento del lote
    created_at? : Date | string;
    create_by_user_id? : number;
    updated_at? : Date | string;
    last_update_by_user_id? : number;
}