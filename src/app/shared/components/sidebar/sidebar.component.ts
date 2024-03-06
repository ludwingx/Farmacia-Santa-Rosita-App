import { Component, Inject} from '@angular/core';

import { DOCUMENT, NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {}

  currentRoute: string = '';
  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // La navegación ha terminado, ahora verifica la ruta actual
        this.checkActiveLinks();
      });
  }

  isLinkActive(route: string): boolean {
    // Comprueba si la ruta actual incluye la ruta proporcionada
    return this.router.url.includes(route);
  }
  onRouteChange(route: string): void {
    // Actualiza la propiedad currentRoute con la ruta actual
    this.currentRoute = route;
  }
  checkActiveLinks(): void {
    const links = this.document.querySelectorAll('.nav_link');
  
    if (links && typeof links.forEach === 'function') {
      links.forEach(link => {
        const route = link.getAttribute('routerLink');
        if (route && this.router.url.includes(route)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }


}
