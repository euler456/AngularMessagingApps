import { Component, OnInit } from '@angular/core';

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
  selectedUserId: number | null = null; // To store the selected user for adding to groups

  constructor() {}

  ngOnInit(): void {
    // Fetch groups and users data from JSON or your backend API
    this.groups = [
      // Your group data here
    ];

    this.users = [
      // Placeholder user data
      { userId: 1, username: 'user1' },
      { userId: 2, username: 'user2' },
      // Add more user data as needed
    ];
  }

  createGroup() {
    // Implement logic to create a new group (e.g., send data to your backend)
    // After creating, refresh the list of groups
    this.groups.push({
      groupid: this.groups.length + 1,
      group: this.groupName,
      channels: [],
    });
    this.groupName = '';
  }

  onGroupChange() {
    if (this.selectedGroupId === null) {
      this.channelName = ''; // Clear channel name input
    }
  }

  createChannel() {
    if (this.selectedGroupId !== null) {
      // Group is selected, proceed with channel creation
      // Implement your channel creation logic here
    }
  }

  addUserToGroup(groupId: number) {
    if (this.selectedUserId !== null) {
      // Implement logic to add the selected user to the specified group
      // After adding, refresh the list of users in the group
    }
  }

  removeUserFromGroup(groupId: number) {
    if (this.selectedUserId !== null) {
      // Implement logic to remove the selected user from the specified group
      // After removing, refresh the list of users in the group
    }
  }

  removeGroup(groupId: number) {
    // Implement logic to remove a group (e.g., send data to your backend)
    // After removing, refresh the list of groups
    this.groups = this.groups.filter((group) => group.groupid !== groupId);
  }

  removeChannel(groupId: number, channelName: string) {
    // Implement logic to remove a channel from the specified group
  }

  refreshGroups() {
    // Implement a method to refresh the list of groups after creating or removing
  }
}
