import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { HttpClient ,HttpHeaders } from '@angular/common/http'; // Import HttpClient
const BACKEND_URL = 'http://localhost:3000'; // Replace with your backend URL
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  messagecontent: string = "";
  messages: { content: string; sender: string }[] = [];
  usersList: any[] = [];
  channelsList: any[] = [];
  selectedGroupId: string | null = null; // To store the selected groupId
  channelMessageHistory: { [channelName: string]: { content: string; sender: string }[] } = {};
  selectedChannelName: string = "Default Channel"; // Initialize with a default value
  channelSelected: boolean = false;
  constructor(
    private socketService: SocketService,
    private httpClient: HttpClient // Inject HttpClient
  ) { }

  ngOnInit() {
    this.initIoConnection();
    this.selectedGroupId = sessionStorage.getItem('selectedGroupId'); // Get groupId from session
  
    // Retrieve the username from session storage
    if (this.selectedGroupId) {
      this.fetchUsersAndChannelsData(this.selectedGroupId); // Fetch data based on groupId
    }
  }
  public joinChannel(channelName: string) {
    const username = sessionStorage.getItem('username') || 'Anonymous';
    const selectedChannel = sessionStorage.getItem('selectedChannel') || 'default';
    this.socketService.joinChannel(channelName);
    if (selectedChannel !== channelName) {
      this.leaveChannel(selectedChannel);
    }
  
    this.loadChannelContent(channelName);
  }
  public leaveChannel(channelName: string) {
    const username = sessionStorage.getItem('username') || 'Anonymous';
    this.socketService.leaveChannel(channelName);
    // Clear messages when leaving a channel
    this.messages = [];
    this.channelSelected = false;
  }

  private initIoConnection() {
    this.socketService.initSocket();
    this.socketService.onMessage().subscribe((message: string) => {
      const username = sessionStorage.getItem('username');
      const selectedChannel = sessionStorage.getItem('selectedChannel') || 'Default Channel'; 
      console.log("Io", selectedChannel);
  
      if (!this.channelMessageHistory[selectedChannel]) {
        this.channelMessageHistory[selectedChannel] = [];
      }
  
      this.channelMessageHistory[selectedChannel].push({
        content: message,
        sender: username || 'Anonymous',
      });
      this.messages = this.channelMessageHistory[selectedChannel];
    });
  }
  
  

  public loadChannelContent(channelName: string) {
    this.selectedChannelName = channelName;
    sessionStorage.setItem('selectedChannel', channelName);
    this.messages = this.channelMessageHistory[channelName] || [];
    this.channelSelected = true; // Set channelSelected to true
  }

  public chat() {
    if (this.messagecontent) {
      const selectedChannel = sessionStorage.getItem('selectedChannel') || 'default'; 
      const username = sessionStorage.getItem('username') || 'Anonymous';
      const messageData = {
        content: this.messagecontent,
        sender: username,
        channel: selectedChannel
      };
      this.socketService.send(JSON.stringify(messageData));      
      this.messagecontent = '';
    } else {
      console.log('no message');
    }
  }
  
  // Fetch users and channels data based on groupId
  private fetchUsersAndChannelsData(groupId: string) {
    const requestPayload = { groupId: groupId };
    this.httpClient.post<any>(BACKEND_URL + '/chat', requestPayload, httpOptions).subscribe(
      (data: any) => {
        // Update usersList and channelsList with the fetched data
        this.usersList = data.users;
        this.channelsList = data.channels;
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Handle error here, e.g., show an error message to the user
      }
    );
  }
  

}