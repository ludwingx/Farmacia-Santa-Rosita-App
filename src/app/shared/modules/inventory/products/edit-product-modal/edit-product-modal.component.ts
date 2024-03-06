import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [],
  templateUrl: './edit-product-modal.component.html',
  styleUrl: './edit-product-modal.component.scss'
})
export class EditProductModalComponent {
  @Input() product: any;
}
