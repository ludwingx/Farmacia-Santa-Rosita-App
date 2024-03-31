import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersApiService } from '../../../core/services/users/users-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  loggedInUserName: string = '';
  constructor(private authService : AuthService,
    private userService: UsersApiService) {}
  ngOnInit() {
    this.loggedInUserName = this.userService.getLoggedInUserName();
  }
}
