import { Component, OnInit } from '@angular/core';
import { IProductsList } from '../../../../../core/interfaces/products.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsApiService } from '../../../../../core/services/products/products-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SuppliersService } from '../../../../../core/services/suppliers/suppliers.service';
import { CategoriesService } from '../../../../../core/services/categories/categories.service';
import { ISuppliers } from '../../../../../core/interfaces/suppliers.interface';
import { ICategories } from '../../../../../core/interfaces/categories.interface';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {
  productId!: number;
  product: IProductsList = {
    id: 0,
    name: '',
    product_code: '',
    description: '',
    selling_price: 0,
    purchase_price: 0,
    initial_stock: 0,
    current_stock: 0,
    category_id: 1,
    supplier_id: 1,
    image: 'assets/img/logo.png',
    notes: '',
    nutritional_information: ''
  };
  suppliers: ISuppliers[] = [];
  categories: ICategories[] = [];
  newImage!: File;
  previewImage: any = null;
  currentImageSource: any = 'assets/img/logo.png';
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsApiService,
    private sanitizer: DomSanitizer,
    private suppliersservice: SuppliersService, 
    private categoriesservice: CategoriesService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  getRoute(path: string): string {
    return this.isDemoMode ? '/demo' + path : path;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      this.loadProduct();
      this.getSuppliers();
      this.getCategories();
    });
  }

  loadProduct(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (data) => {
        if (data) {
          this.product = { ...data };
          this.currentImageSource = data.image || 'assets/img/logo.png';
        }
      },
      error: (error) => {
        console.error('Error al obtener el producto:', error);
        this.toastr.error('No se pudo cargar el medicamento');
      }
    });
  }

  getSuppliers(): void {
    this.suppliersservice.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data || [];
        if (this.suppliers.length === 0) {
          this.suppliers = [
            { id: 1, name: 'Droguería INTI S.A.' },
            { id: 2, name: 'Laboratorios Bagó de Bolivia' },
            { id: 3, name: 'Laboratorios IFA S.A.' },
            { id: 4, name: 'Terbol S.A.' }
          ];
        }
      },
      error: () => {
        this.suppliers = [
          { id: 1, name: 'Droguería INTI S.A.' },
          { id: 2, name: 'Laboratorios Bagó de Bolivia' },
          { id: 3, name: 'Laboratorios IFA S.A.' },
          { id: 4, name: 'Terbol S.A.' }
        ];
      }
    });
  }

  getCategories(): void {
    this.categoriesservice.getCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
        if (this.categories.length === 0) {
          this.categories = [
            { id: 1, name: 'Analgésicos y Antiinflamatorios' },
            { id: 2, name: 'Antibióticos y Antimicrobianos' },
            { id: 3, name: 'Salud Cardiovascular' },
            { id: 4, name: 'Gastrointestinales' },
            { id: 5, name: 'Vitaminas y Suplementos' },
            { id: 6, name: 'Respiratorio y Antihistamínicos' }
          ];
        }
      },
      error: () => {
        this.categories = [
          { id: 1, name: 'Analgésicos y Antiinflamatorios' },
          { id: 2, name: 'Antibióticos y Antimicrobianos' },
          { id: 3, name: 'Salud Cardiovascular' },
          { id: 4, name: 'Gastrointestinales' },
          { id: 5, name: 'Vitaminas y Suplementos' },
          { id: 6, name: 'Respiratorio y Antihistamínicos' }
        ];
      }
    });
  }

  goToProductList(): void {
    this.router.navigate([this.getRoute('/inventory')]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  onImageChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.newImage = files[0];
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.newImage));
      this.currentImageSource = this.previewImage;
    }
  }

  saveProductChanges(): void {
    if (!this.product.name || !this.product.product_code || !this.product.selling_price) {
      this.toastr.warning('Por favor completa los campos requeridos (Nombre, Código, Precio)');
      return;
    }

    this.isSubmitting = true;
    this.productService.updateProduct(this.productId, this.product).subscribe({
      next: () => {
        this.toastr.success(`Medicamento "${this.product.name}" actualizado con éxito`, 'Cambios Guardados');
        this.isSubmitting = false;
        this.goToProductList();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al actualizar el producto:', error);
        this.toastr.error('Error al actualizar el medicamento');
      }
    });
  }
}
