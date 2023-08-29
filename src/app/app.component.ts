import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}
  title = 'week4tut';
  logout() {
    // Clear session storage
    sessionStorage.clear();
    // Navigate to login page
    this.router.navigateByUrl('/login');
  }
}
