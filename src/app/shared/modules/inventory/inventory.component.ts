import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductsComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  constructor(private router: Router, private authService: AuthService) {}

  get isDemoMode(): boolean {
    return this.router.url.startsWith('/demo') || this.authService.isDemoActive();
  }

  getRoute(path: string): string {
    return this.isDemoMode ? '/demo' + path : path;
  }
}
