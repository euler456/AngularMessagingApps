import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  usersList: { name: string; profileImage: string }[] = [];
  imageSource: any;
  messagecontent: string = "";
  textMessages: { data: string; content: string; sender: string }[] = [];
  imageMessages: { content: string; sender: string }[] = [];
  channelsList: any[] = [];
  selectedGroupId: string | null = null;
  selectedChannelName: string = "Default Channel";
  channelSelected: boolean = false;

  constructor(
    public socketService: SocketService,
    public httpClient: HttpClient,
    public sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.selectedGroupId = sessionStorage.getItem('selectedGroupId');

    if (this.selectedGroupId) {
      this.fetchUsersAndChannelsData(this.selectedGroupId);
    }

    setInterval(() => {
      this.initIoConnection();
    }, 1000);
  }

  public getUserProfileImageUrl(sender: string): string {
    const username = sender.toLowerCase();
    return `${BACKEND_URL}/image/${username}.jpg`;
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

    // Manually trigger change detection
    this.cd.detectChanges();
  }

  public async initIoConnection() {
    this.socketService.initSocket();
    this.socketService.onMessage().subscribe(async (message: any) => {
      try {
        const username = sessionStorage.getItem('username');
        const selectedChannel = sessionStorage.getItem('selectedChannel') || 'Default Channel';

        if (!this.isMessageInArray(message, this.textMessages)) {
          if (message.content.startsWith('data:image/png')) {
            try {
              const base64String = message.content.split(',')[1];
              this.textMessages.push({
                data: 'base64',
                content: String(base64String),
                sender: message.sender || 'Anonymous'
              });

              // Manually trigger change detection
              this.cd.detectChanges();
            } catch (error) {
              console.error('Error decoding image:', error);
            }
          } else {
            this.textMessages.push({
              data: 'normal',
              content: message.content,
              sender: message.sender || 'Anonymous',
            });
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    this.socketService.onLatestMessages().subscribe(async (latestMessages: any[]) => {
      for (const msg of latestMessages) {
        if (!this.isMessageInArray(msg, this.textMessages)) {
          try {
            const content = msg.content;
            if (content.startsWith('data:image/png')) {
              const base64String = msg.content.split(',')[1];
              this.textMessages.push({
                data: 'base64',
                content: String(base64String),
                sender: msg.sender || 'Anonymous'
              });
              // Trigger change detection
              this.cd.detectChanges();
            } else {
              this.textMessages.push({
                data: 'normal',
                content: msg.content,
                sender: msg.sender || 'Anonymous'
              });
            }
          } catch (error) {
            console.error('Error processing message:', error);
          }
        }
      }
    });
  }
  
  private isMessageInArray(message: any, messageArray: any[]): boolean {
    return messageArray.some((m) => m.content === message.content);
  }

 public onFileSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string);
      console.log(base64);
      this.sendImageToServer(base64);
    };
    reader.readAsDataURL(file);
  }
}
  public extractBase64(jsonString: string): Promise<string> {
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
      return ''; 
    }
  }
  

  public sendImageToServer(base64: string) {
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

  public fetchUsersAndChannelsData(groupId: string) {
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