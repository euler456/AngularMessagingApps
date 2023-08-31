import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { group } from '@angular/animations';

const BACKEND_URL = 'http://localhost:3000'; // Replace with your backend URL
const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
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
    // Fetch user's groups from the backend
    this.fetchUserGroups();
  }
  getGroupIDFromStorage(): number | null {
    const groupIDFromSession = sessionStorage.getItem('groups');
    return groupIDFromSession ? parseInt(groupIDFromSession) : null;
  }
  private fetchUserGroups(): void {
    const userId = sessionStorage.getItem('userid'); // Get user's ID from session
    const groupIDFromSession = sessionStorage.getItem('groups');
    const groupID = groupIDFromSession ? parseInt(groupIDFromSession) : null;
    const requestPayload = { groupID: groupID };
    if (!userId) {
      // Redirect to login if user is not authenticated
      this.router.navigateByUrl('/login');
      return;
    } else {
      // Send request to /loginafter endpoint
      this.httpClient.post<string[]>(BACKEND_URL + '/loginafter', requestPayload, httpOptions)
        .subscribe(
          (usernames: string[]) => {
            console.log(usernames);
            this.userGroups = [{ usernames: usernames }];
          },
          (error) => {
            console.error('Error fetching user groups:', error);
            // Handle error here, e.g., show an error message to the user
          }
        );
    }
  }
}
