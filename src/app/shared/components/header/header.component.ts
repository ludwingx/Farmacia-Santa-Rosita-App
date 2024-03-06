import { Component } from '@angular/core';
import { OpenmenuService } from '../../../core/services/openmenu.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private openmenuService: OpenmenuService) {}

  toggleMenu() {
    this.openmenuService.toggleMenu();
  }
  }

