import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductsApiService } from '../../../../../core/services/products/products-api.service';
import { CategoriesService } from '../../../../../core/services/categories/categories.service';
import { SuppliersService } from '../../../../../core/services/suppliers/suppliers.service';
import { ISuppliers } from '../../../../../core/interfaces/suppliers.interface';
import { ICategories } from '../../../../../core/interfaces/categories.interface';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent {
  newImage!: File ; 
  previewImage: any = null;
  suppliers!: ISuppliers[];
  categories!: ICategories[];
  currentImageSource: any;
  constructor(
    private suppliersservice: SuppliersService, 
    private categoriesservice:CategoriesService,
    private router: Router,

    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.getSuppliers();
    this.getCategories();
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
        console.log(this.categories);
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }
  goToProductList(): void {
    this.router.navigate(['inventory'])
  }
  onImageChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.newImage = files[0];
      // Mostrar la vista previa de la nueva imagen
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.newImage));
      // Actualizar la fuente de la imagen actual
      this.currentImageSource = this.previewImage;
    }
  }
}
