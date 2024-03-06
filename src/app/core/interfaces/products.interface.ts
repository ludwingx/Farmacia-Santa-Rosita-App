
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
    id: number;
    image: string;
    name: string;
    product_code: string;
    description: string;
    price: number;
    initial_stock: number;
    expiration_date: Date;
    supplier_id: number;
    lot_number: string;
    storage_location: string;
    nutritional_information: string;
    notes: string;
    category_id: number;
    current_stock: number;
    created_at: Date;
    updated_at: Date;

    
}