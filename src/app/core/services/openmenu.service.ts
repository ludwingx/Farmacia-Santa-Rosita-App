import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenmenuService {
  private isOpenMenu = new BehaviorSubject<boolean>(true);
  isOpenMenu$ = this.isOpenMenu.asObservable();

  toggleMenu() {
    this.isOpenMenu.next(!this.isOpenMenu.value);
  }

}
