import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  isLoggedIn() {
    // Check if user is logged in (you may have your own logic for this)
    return !!sessionStorage.getItem('roles');
  }

  getUserRole() {
    return sessionStorage.getItem('roles');
  }

  logout() {
    // Clear session storage
    sessionStorage.clear();
    // Navigate to login page
    this.router.navigateByUrl('/login');
  }
}
