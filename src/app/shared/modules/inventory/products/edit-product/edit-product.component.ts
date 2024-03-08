import { Component } from '@angular/core';
import { IProductsList } from '../../../../../core/interfaces/products.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsApiService } from '../../../../../core/services/products/products-api.service';
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  productId!: number; 
  product!: IProductsList;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsApiService
  ) {}

  ngOnInit(): void {
    // Obtener la ID del producto de la ruta
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      this.productService.getProduct(this.productId).subscribe((product) => {
        this.product = product;
      });
    });
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProduct(this.productId).subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
      }
    );
  }
  saveChanges(): void {
    // Lógica para guardar los cambios en el producto utilizando el servicio
    this.productService.updateProduct(this.productId, this.product).subscribe(
      (data) => {
        console.log('Producto actualizado exitosamente:', data);
        this.router.navigate(['/productos']);
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );
  }
}
