import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductsApiService } from '../../../../../core/services/products/products-api.service';

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
  currentImageSource: any;
  constructor(

    private router: Router,
    private productService: ProductsApiService,
    private sanitizer: DomSanitizer
  ) {}
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
