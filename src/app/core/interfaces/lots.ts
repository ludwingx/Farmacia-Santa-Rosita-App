export interface ILots {
    id : number;
    product_id : number;
    quantity : number;
    initial_quantity : number;
    expiration_date : Date;
    created_at : Date;
    create_by_user_id : number;
    updated_at : Date;
    last_update_by_user_id : number;
}