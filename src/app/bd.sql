
CREATE TABLE products (
    id INT PRIMARY KEY, -- Identificador unico para cada producto
    name VARCHAR(255), --Nombre del producto
    product_code VARCHAR(20) UNIQUE, -- Código del producto
    description TEXT, --descripción del producto
    price DECIMAL(10, 2), -- Precio del producto
    initial_stock INT, -- Stock inicial
    expiration_date DATE, -- Fecha de caducidad
    supplier_id INT, -- Referencia a la tabla de proveedores
    lot_number VARCHAR(20), -- Lote
    storage_location VARCHAR(50), -- Lugar de almacenamiento
    nutritional_information TEXT, -- Información nutricional
    notes TEXT, -- Notas
    category_id INT,  -- Referencia a la tabla de categorías
    current_stock INT, -- Stock actual
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de actualización
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id), 
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE TABLE categories (
    id INT PRIMARY KEY, -- Identificador unico para cada categoría
    name VARCHAR(255) UNIQUE -- Nombre de la categoría
);
CREATE TABLE sales (
    id INT PRIMARY KEY, -- Identificador unico para cada venta
    product_id INT, -- Referencia a la tabla de proyectos
    customer_id INT, -- Referencia a la tabla de clientes
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de la venta
    quantity INT, -- Cantidad de productos vendidos
    total_amount DECIMAL(10, 2), -- Importe total de la venta
    FOREIGN KEY (product_id) REFERENCES products(id) -- Llave externa a la tabla de productos
);

CREATE TABLE suppliers (
    id INT PRIMARY KEY, -- Identificador unico para cada proveedor
    name VARCHAR(255), -- Nombre del proveedor
    address VARCHAR(255), -- Dirección del proveedor
    phone_number VARCHAR(20) -- Telefono del proveedor
);

CREATE TABLE reports (
    id INT PRIMARY KEY,-- Identificador unico para cada informe
    type VARCHAR(255),-- Tipo de informe
    content TEXT, -- Contenido del informe
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha del informe
);

CREATE TABLE expiration (
    id INT PRIMARY KEY, -- Identificador unico para cada producto
    product_id INT, -- Referencia a la tabla de proyectos
    expiration_date DATE, -- Fecha de caducidad
    FOREIGN KEY (product_id) REFERENCES products(id) -- Llave externa a la tabla de proyectos
);

CREATE TABLE users (
    id INT PRIMARY KEY, -- Identificador unico para cada usuario
    username VARCHAR(255), -- Nombre de usuario
    name VARCHAR(255), -- Nombre del usuario
    email VARCHAR(255), -- Correo electronico
    password VARCHAR(255), -- Contrasena
    role_id INT, -- Referencia a la tabla de roles
    FOREIGN KEY (role_id) REFERENCES roles(id) -- Llave externa a la tabla de roles

);

CREATE TABLE roles (
    id INT PRIMARY KEY, -- Identificador unico para cada rol
    name VARCHAR(255) -- Nombre del rol
);

CREATE TABLE stock_adjustments (
    id INT PRIMARY KEY, -- Identificador unico para cada ajuste de stock
    product_id INT, -- Referencia a la tabla de proyectos
    adjusted_quantity INT, -- Cantidad ajustada
    adjustment_type ENUM('entry', 'exit'), -- Tipo de ajuste
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha del ajuste
    FOREIGN KEY (product_id) REFERENCES products(id) -- Llave externa a la tabla de proyectos
);