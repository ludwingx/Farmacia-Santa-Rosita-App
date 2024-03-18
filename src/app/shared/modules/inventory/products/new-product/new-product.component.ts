import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductsApiService } from '../../../../../core/services/products/products-api.service';
import { CategoriesService } from '../../../../../core/services/categories/categories.service';
import { SuppliersService } from '../../../../../core/services/suppliers/suppliers.service';
import { ISuppliers } from '../../../../../core/interfaces/suppliers.interface';
import { ICategories } from '../../../../../core/interfaces/categories.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iproduct } from '../../../../../core/interfaces/products.interface';
import { IStorage_location } from '../../../../../core/interfaces/storage_location.interface';
import { StorageLocationService } from '../../../../../core/services/storage_location/storage-location.service';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent {
  newImage!: File;
  previewImage: any = null;
  suppliers: ISuppliers[] = [];
  categories: ICategories[] = [];
  product: Iproduct[] = [];
  currentImageSource: any;
  storage_locations: IStorage_location[] = [];
  form: FormGroup;
  constructor(
    private suppliersservice: SuppliersService,
    private categoriesservice: CategoriesService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private productService: ProductsApiService,
    private storagelocationService: StorageLocationService,
  ) {
    this.form = this.fb.group({
      image: [''],
      name: ['', Validators.required],
      product_code: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      initial_stock: ['', Validators.required],
      expiration_date: ['', Validators.required],
      supplier_id: ['', Validators.required],
      lot_number: ['', Validators.required],
      storage_location_id: ['', Validators.required],
      nutritional_information: ['', Validators.required],
      notes: ['', Validators.required],
      category_id: ['', Validators.required],
      current_stock: [''],
      created_at: [new Date()],
      updated_at: [new Date()],
    });
  }
  ngOnInit(): void {
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
      const initialStockValue = this.form.get('initial_stock')?.value; // Agrega '?' para evitar errores de acceso a propiedad de null
      
      if (initialStockValue !== null && initialStockValue !== undefined) {
        // Asigna el valor de initial_stock a current_stock
        this.form.patchValue({
          current_stock: initialStockValue
        });
        
        // Guarda el producto con los valores actualizados
        this.productService.saveProduct(this.form.value).subscribe({
          next: () => {
            this.router.navigate(['inventory']);
          },
          error: (error) => {
            console.error('Error al crear el producto:', error);
          }
        });
      } else {
        console.error('Valor de initial_stock es null o undefined');
      }
    }
  }
}
