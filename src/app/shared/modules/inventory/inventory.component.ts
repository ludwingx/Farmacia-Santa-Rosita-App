import { Component, ElementRef, ViewChild } from '@angular/core';
import { FiltersProductsComponent } from './filters-products/filters-products.component';
import { ProductsComponent } from './products/products.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Quagga from 'quagga';


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FiltersProductsComponent, ProductsComponent, CommonModule, FormsModule, ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  @ViewChild('videoElement')videoElement!: ElementRef;
  @ViewChild('barcodeImage') barcodeImage!: ElementRef;
  barcodeResult!: string;
  scannedBarcodeImage!: string;
  constructor(private router: Router,
    
  ) {}

  ngOnInit(): void {
    this.initCamera();
  }

  async initCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();
      this.initQuagga();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  initQuagga() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: this.videoElement.nativeElement
      },
      decoder: {
        readers: ["ean_reader"] // Puedes especificar los tipos de códigos de barras que quieres detectar aquí
      }
    }, (err: any) => {
      if (err) {
        console.error('Error initializing Quagga:', err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected(this.onBarcodeDetected.bind(this));
  }

  onBarcodeDetected(result: { codeResult: { code: string; }; }) {
    this.barcodeResult = result.codeResult.code;
    this.scannedBarcodeImage = this.videoElement.nativeElement.toDataURL(); // Convertir el video a imagen
    Quagga.stop();
  }
  generatePDF(){

  }
}
