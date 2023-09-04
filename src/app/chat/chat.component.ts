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
  

  private initIoConnection() {
    this.socketService.initSocket();
    this.socketService.onMessage()
      .subscribe((message: string) => {
        // Retrieve the username from session storage
        const username = sessionStorage.getItem('username');
  
        // When a message is received, add it to the messages array with the username
        this.messages.push({ content: message, sender: username || "Anonymous" });
      });
  }
  

  public chat() {
    if (this.messagecontent) {
      this.socketService.send(this.messagecontent);
      // Store the username in session storage (you can replace 'yourUsername' with the actual username)  
      this.messagecontent = "";
    } else {
      console.log("no message");
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
