import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = 'http://localhost:3000'; // Replace with your backend URL
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userGroups: any[] = []; // Array to store user's groups

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userid'); // Get user's ID from session
    if (!userId) {
      // Redirect to login if the user is not authenticated
      this.router.navigateByUrl('/login');
      return;
    } else {
      // Fetch user's groups from the backend only if userId is available
      this.fetchUserGroups(userId);
    }
  }

  fetchUserGroups(userId: string): void {
    const requestPayload = { 
      action: 'fetchinfo',
      userId: userId };
    this.httpClient.post<any[]>(BACKEND_URL + '/loginafter', requestPayload, httpOptions).subscribe(
      (groups: any[]) => {
        console.log(groups);

        // Assign user's groups to a component property
        this.userGroups = groups;
      },
      (error) => {
        console.error('Error fetching user groups:', error);
        // Handle error here, e.g., show an error message to the user
      }
    );
  }

  saveSelectedGroup(groupId: number): void {
    // Save the selected groupId in session storage
    sessionStorage.setItem('selectedGroupId', groupId.toString());
  }
}
