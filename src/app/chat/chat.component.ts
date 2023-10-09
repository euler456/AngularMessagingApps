import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

const BACKEND_URL = 'http://localhost:3000';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  imageSource:any;
  messagecontent: string = "";
  textMessages: { data:string; content: string; sender: string }[] = [];
  imageMessages: { content: string; sender: string }[] = [];
  usersList: any[] = [];
  channelsList: any[] = [];
  selectedGroupId: string | null = null;
  selectedChannelName: string = "Default Channel";
  channelSelected: boolean = false;
  constructor(
    private socketService: SocketService,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.initIoConnection();
    this.selectedGroupId = sessionStorage.getItem('selectedGroupId');

    if (this.selectedGroupId) {
      this.fetchUsersAndChannelsData(this.selectedGroupId);
    }
  }

  public joinChannel(channelName: string) {
    const username = sessionStorage.getItem('username') || 'Anonymous';
    const selectedChannel = sessionStorage.getItem('selectedChannel') || 'default';
    const messageData = {
      content: this.messagecontent,
      sender: username,
      channel: selectedChannel
    };
    this.socketService.joinChannel(JSON.stringify(messageData));
    if (selectedChannel !== channelName) {
      this.leaveChannel(selectedChannel);
    }
  }

  public leaveChannel(channelName: string) {
    const username = sessionStorage.getItem('username') || 'Anonymous';
    const selectedChannel = sessionStorage.getItem('selectedChannel') || 'default';
    const messageData = {
      content: this.messagecontent,
      sender: username,
      channel: selectedChannel
    };
    this.socketService.leaveChannel(JSON.stringify(messageData));    
    this.textMessages = [];
    this.imageMessages = [];
    this.channelSelected = false;
  }

  private async initIoConnection() {
    this.socketService.initSocket();
    this.socketService.onMessage().subscribe(async (message: string) => {
      try {
        const username = sessionStorage.getItem('username');
        const selectedChannel = sessionStorage.getItem('selectedChannel') || 'Default Channel'; 
        if (message.startsWith('{"content":"data:image/png')) {
          try {
            const base64String = await this.extractBase64(message);
            
            console.log(this.textMessages);

          } catch (error) {
            console.error('Error decoding image:', error);
          }
        } else {
          this.textMessages.push({
            data: 'normal',
            content: message,
            sender: username || 'Anonymous',
          });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    this.socketService.onLatestMessages().subscribe(async (latestMessages: any[]) => {
      for (const msg of latestMessages) {
        try {
          if (msg && msg.content && typeof msg.content === 'string' && msg.content.startsWith('data:image/png;base64,')) {
            const base64String = msg.content.split(',')[1];
           
          } else {
            // Handle other types of messages if needed
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
    
  }

 public onFileSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string);
      this.sendImageToServer(base64);
    };
    reader.readAsDataURL(file);
  }
}
  private extractBase64(jsonString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const jsonObject = JSON.parse(jsonString);
        const base64String = jsonObject.content.split(',')[1]; // Extract base64 string after comma
        resolve(base64String);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  decodeBase64(message: {  data: string,content: string }): string {
    try {
      const base64String = message.content;
      console.log("success decode");
      return `data:image/png;base64, ${base64String}`;
    } catch (error) {
      console.error('Error decoding image:', error);
      return ''; // Return an empty string or a placeholder image URL if decoding fails
    }
  }  

  private sendImageToServer(base64: string) {
    const selectedChannel = sessionStorage.getItem('selectedChannel') || 'default';
    const username = sessionStorage.getItem('username') || 'Anonymous';
    const filename = sessionStorage.getItem('filename') || 'Null';
    const messageData = {
      content: base64,
      sender: username,
      channel: selectedChannel
    };
    this.socketService.sendImage(JSON.stringify(messageData));
  }

  public loadChannelContent(channelName: string) {
    this.selectedChannelName = channelName;
    sessionStorage.setItem('selectedChannel', channelName);
    this.socketService.onLatestMessages().subscribe(async (latestMessages: any[]) => {
      console.log(latestMessages);
      for (const msg of latestMessages) {
        try {
          const content = msg.content;
          if (content && content.startsWith('data:image/png;base64,')) {
            const base64String = msg.content.split(',')[1];
            this.textMessages.push({
              data: 'base64',
              content: String(base64String),
              sender: msg.username || 'Anonymous'
            });
          } else {
            // Handle other types of messages if needed
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
    
    this.channelSelected = true;
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

  private fetchUsersAndChannelsData(groupId: string) {
    const requestPayload = { groupId: groupId };
    this.httpClient.post<any>(BACKEND_URL + '/chat', requestPayload, httpOptions).subscribe(
      (data: any) => {
        this.usersList = data.users;
        this.channelsList = data.channels;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}