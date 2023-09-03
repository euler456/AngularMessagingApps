import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messagecontent: string = "";
  messages: { content: string; sender: string }[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
  }

  private initIoConnection() {
    this.socketService.initSocket();
    this.socketService.onMessage()
      .subscribe((message: string) => {
        // When a message is received, add it to the messages array with a dummy sender
        // You can modify the sender logic if needed
        this.messages.push({ content: message, sender: "SenderName" });
      })
  }

  public chat() {
    if (this.messagecontent) {
      this.socketService.send(this.messagecontent);
      this.messagecontent = "";
    } else {
      console.log("no message");
    }
  }
}
