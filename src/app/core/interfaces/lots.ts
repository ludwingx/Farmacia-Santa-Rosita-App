export interface ILots {
    id : number;
    product_id : number;
    quantity : number;  //se pide unidades del lote que se ingresara
    initial_quantity : number; 
    expiration_date : Date; //se pide fecha de vencimiento del lote
    created_at : Date;
    create_by_user_id : number;
    updated_at : Date;
    last_update_by_user_id : number;
}