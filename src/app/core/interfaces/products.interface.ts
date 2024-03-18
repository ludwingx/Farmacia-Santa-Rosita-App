
// CREATE TABLE products (
//     id INT PRIMARY KEY, -- Identificador unico para cada producto
//     name VARCHAR(255), --Nombre del producto
//     product_code VARCHAR(20) UNIQUE, -- Código del producto
//     description TEXT, --descripción del producto
//     price DECIMAL(10, 2), -- Precio del producto
//     initial_stock INT, -- Stock inicial
//     expiration_date DATE, -- Fecha de caducidad
//     supplier_id INT, -- Referencia a la tabla de proveedores
//     lot_number VARCHAR(20), -- Lote
//     storage_location VARCHAR(50), -- Lugar de almacenamiento
//     nutritional_information TEXT, -- Información nutricional
//     notes TEXT, -- Notas
//     category_id INT,  -- Referencia a la tabla de categorías
//     current_stock INT, -- Stock actual
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de actualización
//     FOREIGN KEY (supplier_id) REFERENCES suppliers(id), 
//     FOREIGN KEY (category_id) REFERENCES categories(id)
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
    supplier_id: number; //referencia a la tabla de proveedores
    lot_number: string; //lote
    storage_location: string; //lugar de almacenamiento
    nutritional_information: string; //información nutricional
    notes: string; //notas
    category_id: number; //referencia a la tabla de categorías
    current_stock: number; //stock actual
    created_at: Date; //fecha de creación
    updated_at: Date; //fecha de actualización

    
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