import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-channel-selection',
  templateUrl: './group-channel-selection.component.html',
  styleUrls: ['./group-channel-selection.component.css']
})
export class GroupChannelSelectionComponent implements OnInit {
  groups = [
    {
      id: 1,
      name: 'Group A',
      channels: [
        { id: 1, name: 'Channel 1' },
        { id: 2, name: 'Channel 2' }
      ]
    },
    {
      id: 2,
      name: 'Group B',
      channels: [
        { id: 3, name: 'Channel 3' },
        { id: 4, name: 'Channel 4' }
      ]
    }
    // Add more groups and channels here
  ];

  selectedGroup: number = null;
  selectedChannel: number = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectChannel(groupId: number, channelId: number): void {
    this.selectedGroup = groupId;
    this.selectedChannel = channelId;
  }

  navigateToChat(): void {
    if (this.selectedGroup !== null && this.selectedChannel !== null) {
      sessionStorage.setItem('selectedGroupId', this.selectedGroup.toString());
      sessionStorage.setItem('selectedChannelId', this.selectedChannel.toString());
      this.router.navigate(['/chat']); // Replace 'chat' with your chat component route
    } else {
      alert('Please select a group and channel.');
    }
  }
}
