import { FiltersProductsComponent } from './filters-products/filters-products.component';
import { ProductsComponent } from './products/products.component';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ElementRef, ViewChild } from '@angular/core';
import Quagga from 'quagga';
import JsBarcode from 'jsbarcode';
import { ProductsApiService } from '../../../core/services/products/products-api.service';
import { IProductsList, IStorage_location } from '../../../core/interfaces/products.interface';
import { ISuppliers } from '../../../core/interfaces/suppliers.interface';
import { ICategories } from '../../../core/interfaces/categories.interface';
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FiltersProductsComponent, ProductsComponent, CommonModule, FormsModule, ReactiveFormsModule, ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('barcode') barcode!: ElementRef;
  code!: string;
  cameraStatus = false;
  errorMessage!: string;
  data1!: string;
  cameraEnabled: boolean = true;
  currentStep = 1;
  totalSteps =5; 
  form: FormGroup;
  newImage!: File ; 
  previewImage: any = null;
  currentImageSource: any;
  suppliers: ISuppliers[] = [];
  categories: ICategories[] = [];
  storage_locations: IStorage_location[] = [];
  formData: any = {
    option1Field: '',
    option2Field: '',
    noExpirationField: ''
  };
  expirationStatus: boolean = false;
  lotCount = 1
  constructor(
    private fb: FormBuilder,
    private productService: ProductsApiService,
  ) {
    this.code = '';
    this.cameraStatus = false;
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
      user_id: [''],
      quantity: ['', Validators.required],

      lots: this.fb.array([
      ]) 
    });
   }
   ngOnInit(){
    this.currentImageSource = 'https://t4.ftcdn.net/jpg/01/19/51/89/240_F_119518938_Tcl86XMM47cIcE4WGEUKN8osMWxdW10p.jpg';

   }
   toggleExpirationStatus() {
    this.expirationStatus = !this.expirationStatus;
    if (!this.expirationStatus) {
      this.form.get('expiration_date')?.setValue('');
      this.form.get('quantity')?.setValue('');
      this.form.get('lot_number')?.setValue('');
    }
  }
  addProduct() {
    if (this.form.valid) {
      console.log(this.form.value);
      // Aquí puedes llamar al servicio para guardar el producto en la base de datos
    }
  }
  addLot() {
    const lotArray = this.fb.group({
      expiration_date: ['', Validators.required],
      quantity: ['', Validators.required],
      lot_number: ['LOT00' + this.lotCount++],
    })
    this.lots.push(lotArray);
  }
  get lots() {
    return this.form.get('lots') as FormArray;
  }
  removeLot(index: number) {
    const lotArray = this.form.get('lots') as FormArray;
    lotArray.removeAt(index);
  }



   onImageChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.newImage = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
        };
        reader.readAsDataURL(this.newImage);
      } else {
        console.error('The selected file is not an image.');
      }
    }
  }
  uploadImage(product: IProductsList) {
    const formData = new FormData();
    formData.append('image', this.newImage);
    
    this.productService.uploadImage(product.id, formData).subscribe(
      (data) => {
        console.log('Imagen subida:', data);
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }
   nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }
  initReader() {
    this.cameraStatus = true;
    Quagga.init({
      inputStream: {
        constraints: {
          facingMode: 'environment' // restrict camera type
        },
        area: { // defines rectangle of the detection
          top: '40%',    // top offset
          right: '0%',  // right offset
          left: '0%',   // left offset
          bottom: '40%'  // bottom offset
        },
      },
      decoder: {
        readers: ['ean_reader'] // restrict code types
      },
    },
    (err: any) => {
      if (err) {
        this.errorMessage = `QuaggaJS could not be initialized, err: ${err}`;
      } else {
        Quagga.start();
        Quagga.onDetected((res: { codeResult: { code: any; }; }) => {
          this.code = res.codeResult.code;
          this.generateBarcode();
          this.stopReader();
        })
      }
    });

  }

  stopReader() {
    this.cameraStatus = false;
    Quagga.stop();
  }
  loadCodeBar(){
    this.form.patchValue({
      product_code: this.code}
    );
  }
  onDetected(data: { codeResult: { code: string; }; }) {
    this.code = data.codeResult.code;
    console.log(this.code);
    this.stopReader();



    
  }

  copyCode() {

  }
  generateBarcode() {
    JsBarcode(this.barcode.nativeElement, this.code, {
      textMargin: 20
    });
    this.loadCodeBar();
  }
  toggleCamera() {
    if (this.cameraEnabled) {
      this.stopReader();
    } else {
      this.initReader();
    }
  }
  clearData() {
    this.code = '';
    this.cameraEnabled = false; 
    
  }
  retryScan() {
    this.cameraEnabled = true;
    this.code = '';
  }
  createProduct(){

  }
}
