import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: any[] = [
    {
      id: 1,
      image: 'https://farmasmart.com/wp-content/uploads/2022/05/PARACETAMOL-500-MG-10-TABLETAS.jpg',
      name: 'Paracetamol',
      product_code: 'PCT001',
      description: 'Alivio para el dolor y la fiebre',
      price: 5.99,
      initial_stock: 100,
      expiration_date: '2024-12-31',
      supplier_id: 1,
      lot_number: 'ABC123',
      storage_location: 'Estante 1',
      nutritional_information: '...',
      notes: 'Guardar en un lugar fresco y seco',
      current_stock: 80,
      created_at: '2022-01-01T12:00:00Z',
      updated_at: '2022-01-01T12:00:00Z',
    },
    {
      id: 2,
      image: 'https://mvgapharma.com/wp-content/uploads/2021/05/Ibuprofeno-800mg-Lateral.jpg',
      name: 'Ibuprofeno',
      product_code: 'PCT002',
      description: 'Medicamento para la fiebre',
      price: 10.99,
      initial_stock: 50,
      expiration_date: '2024-12-31',
      supplier_id: 2,
      lot_number: 'DEF456',
      storage_location: 'Estante 2',
      nutritional_information: '...',
      notes: '...',
      current_stock: 30,
      created_at: '2022-01-01T12:00:00Z',
      updated_at: '2022-01-01T12:00:00Z',
      
    }
  ]
}
