import { Component, OnInit } from '@angular/core';
import { IProductsList } from '../../../../../core/interfaces/products.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsApiService } from '../../../../../core/services/products/products-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SuppliersService } from '../../../../../core/services/suppliers/suppliers.service';
import { CategoriesService } from '../../../../../core/services/categories/categories.service';
import { ISuppliers } from '../../../../../core/interfaces/suppliers.interface';
import { ICategories } from '../../../../../core/interfaces/categories.interface';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit{
  productId!: number;
  product!: IProductsList;
  suppliers!: ISuppliers[];
  categories!: ICategories[];
  newImage!: File;
  previewImage: any = null;
  currentImageSource: any;
  currentCategory: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsApiService,
    private sanitizer: DomSanitizer,
    private suppliersservice: SuppliersService, 
    private categoriesservice:CategoriesService
  ) {}

  ngOnInit():void {

    // Obtener la ID del producto de la ruta
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      this.productService.getProduct(this.productId).subscribe((product) => {
        this.product = product;
        this.currentImageSource = this.sanitizer.bypassSecurityTrustUrl(product.image);
        this.currentCategory = product.category.toString();

        console.log('Current Category:', this.currentCategory);
      });
    });
    this.loadProduct();
    this.getSuppliers();
    this.getCategories();
    
  }
  getCategoryName(categoryId: string): string {
    const selectedCategory = this.categories.find(category => category.id === categoryId);
    return selectedCategory ? selectedCategory.name : '';
  }
  
  // Agrega esta función para rastrear las categorías por su ID
  trackCategoryById(index: number, category: any): string {
    return category.id;
  }
  onImageChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.newImage = files[0];
      // Mostrar la vista previa de la nueva imagen
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.newImage));
      // Actualizar la fuente de la imagen actual
      this.currentImageSource = this.previewImage;
    }
  }
  getSuppliers() {
    this.suppliersservice.getSuppliers().subscribe(
      (data) => {
        this.suppliers = data;

      },
      (error) => {
        console.error('Error al obtener los proveedores:', error);
      }
    );
  }

  getCategories() {
    this.categoriesservice.getCategories().subscribe(
      (data) => {
        this.categories = data;

      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }
  loadProduct() {
    this.productService.getProduct(this.productId).subscribe(
      (data) => {
        this.product = data;
        this.currentCategory = data.category.toString(); // Asignar la categoría actual
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
      }
    );
  }
  saveChanges() {
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
  goToProductList(): void {
    this.router.navigate(['inventory'])
  }

  updateProduct(product: any) {
    // Llama al servicio para actualizar el producto en la base de datos
    this.productService.updateProduct(product.id, product).subscribe(() => {
      // Navega de nuevo a la lista de productos después de la actualización
      this.router.navigate(['inventory']);
    });
  }

}
