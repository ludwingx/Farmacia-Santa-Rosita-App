import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ProductsApiService } from '../../../../../core/services/products/products-api.service';
import { CategoriesService } from '../../../../../core/services/categories/categories.service';
import { SuppliersService } from '../../../../../core/services/suppliers/suppliers.service';
import { ISuppliers } from '../../../../../core/interfaces/suppliers.interface';
import { ICategories } from '../../../../../core/interfaces/categories.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProductsList } from '../../../../../core/interfaces/products.interface';
import { IStorage_location } from '../../../../../core/interfaces/storage_location.interface';
import { StorageLocationService } from '../../../../../core/services/storage_location/storage-location.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent implements OnInit {
  newImage!: File;
  previewImage: any = null;
  suppliers: ISuppliers[] = [];
  categories: ICategories[] = [];
  product: IProductsList[] = [];
  currentImageSource: string = 'assets/img/logo.png';
  storage_locations: IStorage_location[] = [];
  form: FormGroup;
  userId: number | undefined;
  isSubmitting: boolean = false;

  constructor(
    private suppliersservice: SuppliersService,
    private categoriesservice: CategoriesService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private productService: ProductsApiService,
    private storagelocationService: StorageLocationService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      image: [''],
      name: ['', Validators.required],
      product_code: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0.1)]],
      initial_stock: ['', [Validators.required, Validators.min(1)]],
      expiration_date: [''],
      supplier_id: ['', Validators.required],
      lot_number: [''],
      storage_location_id: [''],
      nutritional_information: [''],
      notes: [''],
      category_id: ['', Validators.required],
      current_stock: [''],
      created_at: [new Date()],
      updated_at: [new Date()],
      user_id: [''] 
    });
  }

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  getRoute(path: string): string {
    return this.isDemoMode ? '/demo' + path : path;
  }

  ngOnInit(): void {
    this.getUserId();
    this.getSuppliers();
    this.getCategories();
    this.getStorageLocation();
  }

  getSuppliers() {
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
      error: (error) => {
        console.error('Error al obtener proveedores:', error);
        this.suppliers = [
          { id: 1, name: 'Droguería INTI S.A.' },
          { id: 2, name: 'Laboratorios Bagó de Bolivia' },
          { id: 3, name: 'Laboratorios IFA S.A.' },
          { id: 4, name: 'Terbol S.A.' }
        ];
      }
    });
  }

  getUserId(): void {
    this.authService.getUserId().subscribe({
      next: (userId: number) => {
        this.userId = userId;
      },
      error: () => {
        this.userId = 1;
      }
    });
  }

  getCategories() {
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

  getStorageLocation() {
    this.storagelocationService.getStorageLocations().subscribe({
      next: (data) => {
        this.storage_locations = data || [];
        if (this.storage_locations.length === 0) {
          this.storage_locations = [
            { id: 1, location: 'Estante A - Mostrador' },
            { id: 2, location: 'Estante B - Antibióticos' },
            { id: 3, location: 'Cámara de Refrigeración' },
            { id: 4, location: 'Almacén Central Depósito' }
          ];
        }
      },
      error: () => {
        this.storage_locations = [
          { id: 1, location: 'Estante A - Mostrador' },
          { id: 2, location: 'Estante B - Antibióticos' },
          { id: 3, location: 'Cámara de Refrigeración' },
          { id: 4, location: 'Almacén Central Depósito' }
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
    if (files.length > 0) {
      this.newImage = files[0];
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.newImage));
      this.currentImageSource = this.previewImage;
    }
  }

  create() {
    if (this.form.valid) {
      this.isSubmitting = true;
      const formVal = { ...this.form.value };
      const initialStockValue = Number(formVal.initial_stock) || 0;
      formVal.initial_stock = initialStockValue;
      formVal.current_stock = initialStockValue;
      formVal.selling_price = Number(formVal.price) || 0;
      formVal.purchase_price = (formVal.selling_price * 0.7).toFixed(2);
      if (this.userId) {
        formVal.user_id = this.userId;
        formVal.create_by_user_id = this.userId;
      }

      this.productService.saveProduct(formVal).subscribe({
        next: () => {
          this.toastr.success(`Medicamento "${formVal.name}" registrado con éxito`, 'Inventario Actualizado');
          this.isSubmitting = false;
          this.goToProductList();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error al crear el producto:', error);
          this.toastr.error('Error al registrar el medicamento');
        }
      });
    } else {
      this.toastr.warning('Por favor completa todos los campos requeridos', 'Formulario Incompleto');
      this.form.markAllAsTouched();
    }
  }
}
