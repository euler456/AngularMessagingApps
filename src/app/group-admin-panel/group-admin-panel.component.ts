import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
const BACKEND_URL = 'http://localhost:3000'; // Replace with your backend URL
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Component({
  selector: 'app-group-admin-panel',
  templateUrl: './group-admin-panel.component.html',
  styleUrls: ['./group-admin-panel.component.css'],
})

export class GroupAdminPanelComponent implements OnInit {
  groupName: string = '';
  channelName: string = '';
  selectedGroupId: number | null = null;
  groups: any[] = [];
  users: any[] = []; // Placeholder for user data
  selectedUserId: number | null = null; // Initialize to null
  userRole: string = ''; // Add a property to store the user's role

  constructor(private httpClient: HttpClient) {}
  ngOnInit(): void {
    this.userRole = sessionStorage.getItem('roles') || ''; 
    if (this.userRole === 'groupadmin' || this.userRole === 'admin') {
      this.fetchGroupsAndUsers();
    }
  }
  private fetchGroupsAndUsers() {
    const requestPayload = {
      action: 'listGroups',
    };
    // Fetch groups data from the Node.js server
    this.httpClient
      .post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions)
      .subscribe(
        (response: any) => {
          this.groups = response.groups;
        },
        (error) => {
          console.error('Error fetching user data:', error);
          // Handle error here, e.g., show an error message to the superadmin
        }
      );

    const requestUser = {
      action: 'fetchUsers',
    };
    this.httpClient
      .post(BACKEND_URL + '/groupadmin', requestUser, httpOptions)
      .subscribe(
        (response: any) => {
          this.users = response.users;
          console.log(this.users);
        },
        (error) => {
          console.error('Error fetching user data:', error);
          // Handle error here, e.g., show an error message to the superadmin
        }
      );
  }
  createGroup() {
    const requestPayload = { 
      action: 'createGroup',
      group: this.groupName
    };
    console.log(this.groupName)
  
    this.httpClient.post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions).subscribe(
      (response: any) => {
        if (response.success) {
          // Group created successfully, refresh the list of groups
          this.refreshGroups();
        } else {
          // Handle any error cases here
          console.error('Failed to create group:', response.error);
        }
      },
      (error) => {
        console.error('Error occurred while creating group:', error);
      }
    );
  }
  

  onGroupChange() {
    if (this.selectedGroupId === null) {
      this.channelName = ''; // Clear channel name input
    }
  }

  createChannel() {
    if (this.selectedGroupId !== null) {
      const channelId = this.selectedGroupId; // Declare and assign channelId here
      const channelName = this.channelName; // Declare and assign channelName here
  
      const requestPayload = {
        action: 'createChannel',
        groupId: channelId,
        channelName: channelName // Use the assigned channelName here
      };
  
      this.httpClient
        .post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions)
        .subscribe((response: any) => {
          if (response.success) {
            this.refreshGroups();
          }
        });
    }
  }
  
  addUserToGroup(groupId: number, selectedUserId: number) {
    if (selectedUserId !== null) {
      const requestPayload = {
        action: 'joinGroup',
        userId: selectedUserId,
        groupId,
      };
      console.log(selectedUserId)
      this.httpClient
        .post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions)
        .subscribe((response: any) => {
          if (response.success) {
            // User joined the group successfully, handle the response if needed
            alert("User successfully joined")
          } else {
            // Handle any error cases here
            console.error('Failed to join the group:', response.message);
            alert("User is already a member of the group.");
          }
        });
    }
  }
  
  

  removeUserFromGroup(groupId: number, selectedUserId: number) {
    if (selectedUserId !== null) {
      const requestPayload = {
        action: 'leaveGroup',
        userId:selectedUserId,
        groupId,
      };
      this.httpClient
        .post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions)
        .subscribe((response: any) => {
          if (response.success) {
            alert("User successfully removed")
          } else {
            // Handle any error cases here
            console.error('Failed to leave the group:', response.message);
            alert("Failed to leave the group")
          }
        });
    }
  }

  removeGroup(groupId: number) {
    const requestPayload = { 
      action: 'deleteGroup',
      groupId: groupId
    };  
    this.httpClient.post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions).subscribe(
    (response: any) => {
      if (response.success) {
        // Group deleted successfully, refresh the list of groups
        this.refreshGroups();
      }
    });
  }

  removeChannel(groupId: number, channelName: string) {
    const requestPayload = { 
      action: 'deleteChannel',
      groupId: groupId,
      channelName:channelName
    };  
    this.httpClient.post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions).subscribe(
      (response: any) => {
        if (response.success) {
          // Channel deleted successfully, refresh the list of channels
          this.refreshGroups();
        }
      });
  }

  refreshGroups() {
    // Fetch the updated list of groups from the server
    const requestPayload = { 
      action: 'listGroups' 
    };
    // Fetch groups data from the Node.js server
    this.httpClient.post(BACKEND_URL + '/groupadmin', requestPayload, httpOptions).subscribe((
      data: any) => {
      this.groups = data.groups;
    });
  }

 
}
