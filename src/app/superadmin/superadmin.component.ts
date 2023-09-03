import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const BACKEND_URL = 'http://localhost:3000'; // Replace with your backend URL
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-profile',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperadminComponent implements OnInit {
  userProfile: any = {}; // Initialize an object to store user profile data
  isAdmin: boolean = false; // Indicate whether the user is an admin or superadmin
  users: any[] = []; // Array to store user data (for superadmin)
 // Modify your newUser object to include roles and password
  newUser: any = {};


  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    // Retrieve user profile data from session storage
    this.userProfile.username = sessionStorage.getItem('username');
    this.userProfile.email = sessionStorage.getItem('emails');
    this.isAdmin = sessionStorage.getItem('roles') === 'admin';

    // If the user is an admin or superadmin, fetch user data (for superadmin)
    if (this.isAdmin) {
      this.fetchUsers();
    }
  }

  // Fetch user data (for superadmin)
  fetchUsers() {
    // Send request to fetch user data from the backend
    this.httpClient.get<any[]>(BACKEND_URL + '/superadmin', httpOptions).subscribe(
      (users: any[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching user data:', error);
        // Handle error here, e.g., show an error message to the superadmin
      }
    );
  }

  // Method to change user role (for superadmin)
  changeUserRole(userId: string, newRole: string) {
    // Send request to the backend to change user role
    const requestPayload = { userId: userId, newRole: newRole };
    this.httpClient.post(BACKEND_URL + '/superadmin', requestPayload, httpOptions).subscribe(
      () => {
        alert('User role changed successfully!');
        // Update the user data after changing the role
        this.fetchUsers();
      },
      (error) => {
        console.error('Error changing user role:', error);
        // Handle error here, e.g., show an error message to the superadmin
      }
    );
  }

  // Method to create a new user (for superadmin)
  createUser() {
    // Prepare the request payload based on your Node.js API
    const requestPayload = {
      action: 'createUser',
      user: this.newUser,
    };

    // Send the request to the backend
    this.httpClient.post(BACKEND_URL + '/superadmin', requestPayload, httpOptions).subscribe(
      (response: any) => {
        if (response.success) {
          alert('User created successfully!');
          // Update the user data after creating a new user
          this.fetchUsers();
          // Clear the newUser object
          this.newUser = {
            username: '',
            email: '',
            roles: '',
            password: '',
            valid: true,
          };
        } else {
          alert('Failed to create user. Please check your input.');
        }
      },
      (error) => {
        console.error('Error creating user:', error);
        // Handle error here, e.g., show an error message to the superadmin
        alert('Error creating user. Please try again later.');
      }
    );
  }
  // Method to delete a user (for superadmin)
  deleteUser(userId: string) {
    // Send request to the backend to delete a user
    this.httpClient.delete(`${BACKEND_URL}/superadmin/${userId}`, httpOptions).subscribe(
      () => {
        alert('User deleted successfully!');
        // Update the user data after deleting a user
        this.fetchUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
        // Handle error here, e.g., show an error message to the superadmin
      }
    );
  }
}
