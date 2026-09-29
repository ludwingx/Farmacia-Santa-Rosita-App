import { Component } from '@angular/core';
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

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent {
  newImage!: File;
  previewImage: any = null;
  suppliers: ISuppliers[] = [];
  categories: ICategories[] = [];
  product: IProductsList[] = [];
  currentImageSource: any;
  storage_locations: IStorage_location[] = [];
  form: FormGroup;
  userId: number | undefined;
  constructor(
    private suppliersservice: SuppliersService,
    private categoriesservice: CategoriesService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private productService: ProductsApiService,
    private storagelocationService: StorageLocationService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      image: [''],
      name: ['', Validators.required],
      product_code: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      initial_stock: ['', Validators.required],
      expiration_date: [''],
      supplier_id: ['', Validators.required],
      lot_number: [''],
      storage_location_id: ['', Validators.required],
      nutritional_information: [''],
      notes: [''],
      category_id: ['', Validators.required],
      current_stock: [''],
      created_at: [new Date()],
      updated_at: [new Date()],
      user_id: [''] 
    });
  }
  ngOnInit(): void {
    this.getUserId();
    this.getSuppliers();
    this.getCategories();
    this.getStorageLocation();
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
  getUserId(): void {
    this.authService.getUserId().subscribe(
      (userId: number) => {
        this.userId = userId;
      },
      (error) => {
        console.error('Error al obtener el ID del usuario:', error);
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
  getStorageLocation() {
    this.storagelocationService.getStorageLocations().subscribe(
      (data) => {
        this.storage_locations = data;

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
  create() {
    console.log('create() ejecutado');
    if (this.form && this.form.valid) {
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
          this.router.navigate(['inventory']);
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
