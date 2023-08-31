import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {}; // Initialize an object to store user profile data

  constructor() { }

  ngOnInit(): void {
    // Retrieve user profile data from session storage
    this.userProfile.username = sessionStorage.getItem('username');
    this.userProfile.groups = sessionStorage.getItem('groups');
    this.userProfile.roles = sessionStorage.getItem('roles');
  }

  // Add a method to update user profile
  updateProfile() {
    // Update user profile data in session storage
    sessionStorage.setItem('username', this.userProfile.username);
    sessionStorage.setItem('groups', this.userProfile.groups);
    sessionStorage.setItem('roles', this.userProfile.roles);
    alert('Profile updated successfully!');
  }
}
